import React, {useEffect, useState, useCallback} from "react";

// import components
import FormFaculties from "./FormFaculties";
import {getAllFaculties, setNewFaculty, removeFaculty} from "../../../firebase";
import {confirmAlert} from "react-confirm-alert";
import Loading from "../../Loading";
import {useDropzone} from "react-dropzone";
import {readExcel, defaultFailCB} from "../../../utils";
import {Button} from "../../Button";

// import styles
import "./Manage.css";

const getFacId = (facName) =>
	facName
		.trim()
		.split(" ")
		.map((word) => word[0].toUpperCase())
		.join("");

// accepted files for react-dropzone in MIME Type
const accept =
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";

const FacultyListItem = ({index, id, facultyName, onClick, onRemove}) => (
	<li key={index} className="list__container-li_item" onClick={onClick}>
		<p className="li__item-search">{index + 1}</p>
		<p className="li__item-search">{id}</p>
		<p className="li__item-search">{facultyName}</p>
		<span className="btn__trash trash" onClick={onRemove}>
			<i className="fas fa-trash-alt" />
		</span>
	</li>
);

const FacultyItemToAdd = ({index, facultyName, onAdd}) => (
	<li key={index} className="list__container-li_item">
		<p>{facultyName}</p>
		<span className="btn__trash add" onClick={onAdd}>
			<i className="far fa-plus-square" />
		</span>
	</li>
);

const ManageFaculties = () => {
	//#region Component State

	const [isLoading, setIsLoading] = useState(true);
	const [facultiesObj, setFacultiesObj] = useState({});
	const [currentFacultyId, setCurrentFacultyId] = useState();
	const [searchString, setSearchString] = useState("");
	const [excelLoadedItems, setExcelLoadedItems] = useState();

	//#endregion

	//#region Hooks

	useEffect(() => {
		getAllFaculties((result) => {
			setFacultiesObj(result);
			setIsLoading(false);
		});
	}, []); // fetching faculties list on componentUpdate

	useEffect(() => {
		const li = document.getElementsByClassName("list__container-li_item");
		for (let i = 0; i < li.length; i++) {
			const items = li[i].querySelectorAll(".li__item-search");
			let isInclude = [];
			items.forEach((item) => {
				let txtValue = item.textContent || item.innerHTML;
				isInclude.push(
					txtValue.toLowerCase().includes(searchString.toLowerCase())
						? true
						: false
				);
			});
			if (isInclude.some((item) => item === true)) {
				li[i].style.display = "";
			} else {
				li[i].style.display = "none";
			}
		}
	}, [searchString]); // search for text in list when searchString change

	// useEffect(() => {
	// 	console.error(facultiesObj);
	// }, [facultiesObj]);

	//#endregion

	//#region Component Method

	const handleOnAdd = (values) => {
		// Trả về Promise để Form đợi tới khi người dùng chọn tùy chọn
		return new Promise((resolve) => {
			if (!!values["faculty-name"]) {
				values["faculty-id"] = getFacId(values["faculty-name"]);
				if (values["faculty-id"] in facultiesObj) {
					confirmAlert({
						title: "Bạn có muốn thay đổi tên khoa?",
						message: "Mã khoa này đã tồn tại",
						buttons: [
							{
								className: "confirm__cancel",
								label: "Hủy",
								onClick: () => {
									resolve();
								},
							},
							{
								className: "sign-out",
								label: "Thay Đổi",
								onClick: () => {
									setNewFaculty(values);
									setIsLoading(true);
									resolve(true);
								},
							},
						],
					});
				} else {
					setNewFaculty(values);
					setIsLoading(true);
					resolve(true);
				}
			}
		});
	};

	const handleOnModify = (values) => {
		return new Promise((resolve) => {
			let id = getFacId(values["faculty-name"]);
			values["faculty-id"] = id;

			if (id !== currentFacultyId) {
				if (values["faculty-id"] in facultiesObj) {
					confirmAlert({
						closeOnEscape: true,
						title: "Bạn có muốn thay đổi tên khoa?",
						message: "Mã khoa này đã tồn tại",
						buttons: [
							{
								className: "confirm__cancel",
								label: "Hủy",
								onClick: () => {
									resolve();
								},
							},
							{
								className: "sign-out",
								label: "Thay Đổi",
								onClick: () => {
									removeFaculty(currentFacultyId);
									setNewFaculty(values);
									resolve(true);
								},
							},
						],
					});
				} else {
					setNewFaculty(values);
					resolve(true);
				}
			} else {
				setNewFaculty(values);
			}
			// Đặt lại id thành null để reset Form
			setCurrentFacultyId("");
			resolve(true);
		});
	};

	const onRemove = (id) => {
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
						removeFaculty(id);
						setCurrentFacultyId("");
					},
				},
			],
		});
	};

	const onDrop = useCallback((acceptedFiles, fileRejections) => {
		if (!!fileRejections.length) {
			defaultFailCB("Tệp tin không phù hợp");
		} else {
			handleExcelLoad(acceptedFiles[0]);
		}
	}, []);

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		accept,
		onDrop,
	});

	const handleAddExcelItem = (item, index) => {
		handleOnAdd(item);
		// const removedList = Array.slice(excelLoadedItems, index, 1);
		// let removedList = excelLoadedItems.slice(index, 1);
		// setExcelLoadedItems(removedList);
	};

	const handleExcelLoad = async (file) => {
		const data = await readExcel(file, ["faculty-name", "faculty-note"]);
		const slicedData = data.slice(1);
		if (slicedData.length === 0) {
			setExcelLoadedItems(<div>Không có dữ liệu</div>);
		} else {
			setExcelLoadedItems(
				slicedData.map((item, index) => (
					<FacultyItemToAdd
						index={index}
						facultyName={item["faculty-name"]}
						onAdd={() => handleAddExcelItem(item, index)}
					/>
				))
			);
		}
		// console.error(data);
	};

	//#endregion

	const getBorderColor = (props) => {
		if (props.isDragAccept) {
			return "#00e676";
		}
		if (props.isDragReject) {
			return "#ff1744";
		}
		if (props.isDragActive) {
			return "#2196f3";
		}
		return "#eeeeee";
	};

	return isLoading ? (
		<Loading />
	) : (
		<div className="mng-container">
			<div className="form-list__container">
				<div className="form__container">
					{/* <div id="excel__loaded-list" className="excel__loaded-list"> */}
					{excelLoadedItems && (
						<Button className="delete" onClick={() => setExcelLoadedItems()}>
							clear
						</Button>
					)}
					{!!excelLoadedItems ? (
						<ul>{excelLoadedItems}</ul>
					) : (
						<div
							className="dropzone__container"
							style={{
								height: (isDragActive || !!excelLoadedItems) && "100%",
								borderColor: getBorderColor({
									...getRootProps({isDragActive, isDragAccept, isDragReject}),
								}),
							}}
							{...getRootProps()}
						>
							<input {...getInputProps()} />
							{isDragActive ? (
								<div style={{width: "100%", height: "100%"}}>
									Thả file vào đây...
								</div>
							) : (
								<p>
									Kéo thả tệp excel vào đây <br />
									hoặc nhấn để chọn tệp của bạn!
								</p>
							)}
						</div>
					)}
					{isDragActive || !!excelLoadedItems || (
						<FormFaculties
							{...{
								facultiesObj,
								currentFacultyId,
								setCurrentFacultyId,
								handleOnAdd,
								handleOnModify,
							}}
						/>
					)}
					{/* </div> */}
				</div>
				<div className="list__container faculties-list">
					<div className="list__container-search">
						<input
							type="text"
							className="text__search"
							onChange={({target}) => setSearchString(target.value)}
							name="search-string"
							value={searchString}
							placeholder="Tìm kiếm..."
						/>
						<div className="list__header">
							<h5>STT</h5>
							<h5>Mã khoa</h5>
							<h5>Tên khoa</h5>
						</div>
					</div>
					{!!Object.keys(facultiesObj).length ? (
						<ul>
							{Object.keys(facultiesObj)
								.reverse()
								.map((id, index) => (
									<FacultyListItem
										index={index}
										id={id}
										facultyName={facultiesObj[id]["faculty-name"]}
										onClick={() => setCurrentFacultyId(id)}
										onRemove={() => onRemove(id)}
									/>
								))}
						</ul>
					) : (
						<p>no lecture</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default ManageFaculties;
