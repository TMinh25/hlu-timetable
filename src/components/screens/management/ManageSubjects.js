import React, { useEffect, useState } from "react";
import {
	getAllSubjects,
	modifySubject,
	newSubject,
	removeSubject,
} from "../../../firebase";
import { defaultFailCB, readExcel, exists, validNumber } from "../../../utils";

// import components
import FormSubjects from "./FormSubjects";
import { Loading, Button, FileDropzone } from "../../Components";
import { confirmAlert } from "react-confirm-alert";

//import styles
import "./Manage.css";

const ManageSubjects = () => {
	//#region State

	const [subjectsObj, setSubjectsObj] = useState({});
	const [currentSubjectId, setCurrentSubjectId] = useState("");
	const [searchString, setSearchString] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [excelLoadedItems, setExcelLoadedItems] = useState([]);

	//#endregion

	//#region Components

	const SubjectListItem = ({
		index,
		onClick,
		onRemove,
		subjectName,
		credit,
		periods,
	}) => {
		return (
			<li
				onClick={onClick}
				className="list__container-li_item"
				key={index.toString()}
			>
				<p className="li__item-search">{index + 1}</p>
				<p className="li__item-search">{subjectName}</p>
				<p>{credit}</p>
				<p>{periods}</p>
				<span className="btn__trash trash" onClick={onRemove}>
					<i className="fas fa-trash-alt" />
				</span>
			</li>
		);
	};

	const SubjectItemToAdd = ({ onAdd, index, subjectName, credit, periods }) => {
		return (
			<li key={index.toString()} className="excel__list-li_item">
				<div className="vert-align">
					<p>
						{exists(subjectName) ? (
							subjectName
						) : (
							<span style={{ color: "red" }}>Không có tên môn</span>
						)}
					</p>
					<div className="hozi-align">
						<p>
							{credit && (
								<>
									<span
										style={{
											color: validNumber(Number.parseInt(credit)) || "red",
										}}
									>
										{credit}
									</span>{" "}
									tín
								</>
							)}
						</p>
						<p>
							{periods && (
								<>
									<span
										style={{
											color: validNumber(Number.parseInt(periods)) || "red",
										}}
									>
										{periods}
									</span>{" "}
									tiết
								</>
							)}
						</p>
					</div>
				</div>
				<span className="btn__trash add" onClick={onAdd}>
					<i className="far fa-plus-square" />
				</span>
			</li>
		);
	};

	//#endregion

	//#region Hooks

	useEffect(() => {
		getAllSubjects((result) => {
			setSubjectsObj(result);
			setIsLoading(false);
		});
	}, [isLoading]);

	useEffect(() => {
		const li = document.getElementsByClassName("list__container-li_item");
		for (let i = 0; i < Object.keys(subjectsObj).length; i++) {
			const item = li[i].getElementsByClassName("li__item-search")[0];
			// let txtValue = item.textContent || item.innerHTML;
			let txtValue = item.textContent || item.innerHTML;
			if (txtValue.toLowerCase().includes(searchString.toLowerCase())) {
				li[i].style.display = "";
			} else {
				li[i].style.display = "none";
			}
		}
		// eslint-disable-next-line
	}, [searchString]); // search for text in list when searchString change

	//#endregion

	//#region Methods

	const handleOnAdd = ({
		values,
		shouldRemoveChild = false,
		event = undefined,
	}) => {
		//remove li element on add
		const removeLi = () => {
			const thisLi = event.target.closest("li");
			let nodes = Array.from(thisLi.closest("ul").children); // get array
			let index = nodes.indexOf(thisLi);
			if (index >= 0) {
				const tempArr = [...excelLoadedItems];
				tempArr.splice(index, 1);
				setExcelLoadedItems(tempArr);
			}
		};

		return new Promise((resolve, reject) => {
			if (!exists(values["subject-name"])) {
				defaultFailCB("Không có tên môn học");
			} else if (
				!validNumber(values["credit"]) ||
				!validNumber(values["periods"])
			) {
				defaultFailCB("Dữ liệu không đúng định dạng số");
			} else {
				newSubject(values);
				setIsLoading(true);
				shouldRemoveChild && removeLi();
				resolve();
			}
		});
	};

	const handleOnModify = (id, values) => {
		if (!!Object.keys(values).length) {
			modifySubject(id, values);
			setCurrentSubjectId(undefined);
			setIsLoading(true);
		}
	};

	const handleOnRemove = (id) => {
		confirmAlert({
			title: "Bạn có chắc muốn xóa khoa này?",
			message: "Bạn sẽ không thể truy cập lại thông tin này",
			buttons: [
				{
					className: "confirm__cancel",
					label: "Hủy",
				},
				{
					className: "sign-out",
					label: "Xóa",
					onClick: () => {
						removeSubject(id);
						setCurrentSubjectId("");
						setIsLoading(true);
					},
				},
			],
		});
	};

	async function handleDropped(files) {
		const objHeaders = ["subject-name", "credit", "periods"];
		const file = files[0];
		try {
			const data = await readExcel(file, objHeaders);
			if (data.length === 0) {
				setExcelLoadedItems(null);
			} else {
				setExcelLoadedItems(data);
			}
		} catch (err) {
			defaultFailCB(err);
		}
	}

	const handleDownloadTemplateFile = () =>
		window.open(
			"https://drive.google.com/file/d/1rTYsYcXKhHf1Cb0jGqLjqiY1edQW-5Z3/view?usp=sharing",
			"_blank",
			""
		);

	//#endregion

	return (
		<>
			<div className="mng-container">
				<div className="form-list__container">
					<div className="form__container">
						{
							// render cancel button if excelLoaded has at least 1 row
							!!excelLoadedItems.length && (
								<Button
									style={{ marginBottom: 10 }}
									className="delete"
									// clear items
									onClick={() => setExcelLoadedItems([])}
								>
									Hủy
								</Button>
							)
						}
						{
							// render excel loaded list items if it has at least 1 row or render dropzone_container
							!!excelLoadedItems.length ? (
								<ul id="excel__loaded-ul subject-ul">
									{excelLoadedItems.map((values, index) => (
										<SubjectItemToAdd
											index={index}
											subjectName={values["subject-name"]}
											credit={values["credit"]}
											periods={values["periods"]}
											onAdd={async (event) => {
												try {
													const res = await handleOnAdd({
														values,
														shouldRemoveChild: true,
														event,
													});
													console.error(res);
												} catch (err) {
													defaultFailCB(err);
												}
											}}
										/>
									))}
								</ul>
							) : (
								<FileDropzone
									{...{
										excelLoadedItems,
										handleDropped,
										handleDownloadTemplateFile,
									}}
								/>
							)
						}
						{
							// remove form if list item has item
							!!excelLoadedItems.length || (
								<FormSubjects
									{...{
										subjectsObj,
										currentSubjectId,
										setCurrentSubjectId,
										handleOnAdd,
										handleOnModify,
									}}
								/>
							)
						}
					</div>
					<div className="list__container subject-list">
						<div className="list__container-search">
							<input
								type="text"
								className="text__search"
								onChange={({ target }) => setSearchString(target.value)}
								name="search-string"
								value={searchString}
								placeholder="Tìm kiếm..."
							/>
							<div className="list__header">
								<h5>STT</h5>
								<h5>Tên học phần</h5>
								<h5>Số tín chỉ</h5>
								<h5>Số tiết</h5>
							</div>
						</div>
						{!!Object.keys(subjectsObj).length ? (
							<ul>
								{Object.keys(subjectsObj)
									.reverse()
									.map((id, index) => {
										return (
											<SubjectListItem
												id={id}
												index={index}
												onClick={() => setCurrentSubjectId(id)}
												onRemove={() => handleOnRemove(id)}
												subjectName={subjectsObj[id]["subject-name"]}
												credit={subjectsObj[id]["credit"]}
												periods={subjectsObj[id]["periods"]}
											/>
										);
									})}
							</ul>
						) : (
							<p>no subject</p>
						)}
					</div>
				</div>
			</div>
			{isLoading && <Loading />}
		</>
	);
};

export default ManageSubjects;
