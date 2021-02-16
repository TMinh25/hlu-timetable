import * as XLSX from "xlsx";
import { toast } from "react-toastify";

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

// success notification
export const defaultSuccessCB = (msg) =>
	toast.success(msg ? `✌ Thành Công: ${msg}!` : "✌ Thành Công!");
// fail notification
export const defaultFailCB = (err) =>
	toast.error(err ? `🚫 Lỗi: ${err}!` : "🚫 Lỗi!");

export const exists = (x) => x !== null && x !== undefined && x !== "";
export const ifExists = (value) => {
	return new Promise((resolve, reject) => {
		exists(value) ? resolve(value) : reject();
	});
};

export const validNumber = (num) => exists(num) && Number.isInteger(num);

export const selectAllOnFocus = (event) => event.target.select();
