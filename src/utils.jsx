import { useEffect } from "react";

import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

// read excel as json
export function readExcel(file, headers) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsArrayBuffer(file);

		fileReader.onload = (e) => {
			const bufferArray = e.target.result;
			const wb = XLSX.read(bufferArray, { type: "buffer" });
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			const data = XLSX.utils.sheet_to_json(ws, {
				header: headers,
				raw: true,
				blankrows: false,
				defval: null, // giá trị mặc định thay cho null hoặc undefined
			});

			if (data.slice(1).length === 0) {
				reject("Không có dữ liệu");
			} else {
				resolve(data.slice(1));
			}
		};

		fileReader.onerror = (error) => {
			reject(error);
		};
	});
}

// normal string to title case (exp: Title Case String)
export function titleCase(str) {
	var splitStr = str.toLowerCase().split(" ");
	for (var i = 0; i < splitStr.length; i++) {
		// You do not need to check if i is larger than splitStr length, as your for does that for you
		// Assign it back to the array
		splitStr[i] =
			splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	// Directly return the joined string
	return splitStr.join(" ");
}

//#region notification

// success notification
export const defaultSuccessCB = (msg) =>
	toast.success(msg ? `✌ Thành Công: ${msg}!` : "✌ Thành Công!");

// fail notification
export const defaultFailCB = (err) =>
	toast.error(err ? `🚫 Lỗi: ${err}!` : "🚫 Lỗi!");

//#endregion

export const exists = (x) => x !== null && x !== undefined && x !== "";

export const ifExists = (value) => {
	return new Promise((resolve, reject) => {
		exists(value) ? resolve(value) : reject();
	});
};

export const validNumber = (num) => exists(num) && Number.isInteger(num);

export const selectAllOnFocus = (event) => event.target.select();

export const ImportScript = (resourceUrl) => {
	useEffect(() => {
		const script = document.createElement("script");
		script.src = resourceUrl;
		script.async = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, [resourceUrl]);
};

export function getHeaderRow(file) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsArrayBuffer(file);

		fileReader.onload = (e) => {
			const bufferArray = e.target.result;
			const wb = XLSX.read(bufferArray, { type: "buffer" });
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];

			var headers = [];
			var range = XLSX.utils.decode_range(ws["!ref"]);
			var C,
				R = range.s.r; /* start in the first row */
			/* walk every column in the range */
			for (C = range.s.c; C <= range.e.c; ++C) {
				var cell =
					ws[
						XLSX.utils.encode_cell({ c: C, r: R })
					]; /* find the cell in the first row */

				var hdr = "UNKNOWN " + C; // <-- replace with your desired default
				if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);

				headers.push(hdr);
			}

			resolve(headers);
		};

		fileReader.onerror = (error) => {
			reject(error);
		};
	});
}
