import React, {useEffect, useState, useCallback} from "react";

// import components
import FormFaculties from "./FormFaculties";
import {getAllFaculties, setNewFaculty, removeFaculty} from "../../../firebase";
import {confirmAlert} from "react-confirm-alert";
import {Loading, Button} from "../../Components";
import {useDropzone} from "react-dropzone";
import {readExcel, defaultFailCB} from "../../../utils";

// import styles
import "./Manage.css";

const getFacId = (facName) =>
	facName
		.trim()
		.split(" ")
		.map((word) => word[0].toUpperCase())
		.join("");

// accepted files for react-dropzone in MIME Type
const accept = [
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"application/vnd.ms-excel",
];

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

const ManageFaculties = () => {
	//#region Component State

	const [isLoading, setIsLoading] = useState(true);
	const [searchString, setSearchString] = useState("");

	const [facultiesObj, setFacultiesObj] = useState({});
	const [currentFacultyId, setCurrentFacultyId] = useState();
	const [excelLoadedItems, setExcelLoadedItems] = useState();

	//#endregion

	//#region Component

	const FacultyItemToAdd = ({onAdd, index, facultyName}) => {
		return (
			<li key={index} className="excel__list-li_item">
				<p>{facultyName}</p>
				<span className="btn__trash add" onClick={onAdd}>
					<i className="far fa-plus-square" />
				</span>
			</li>
		);
	};

	//#endregion

	//#region Hooks

	useEffect(() => {
		getAllFaculties((res) => {
			setFacultiesObj(res);
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

	const onDrop = useCallback((acceptedFiles, fileRejections) => {
		if (!!fileRejections.length) {
			defaultFailCB("Tệp tin không phù hợp");
		} else {
			handleExcelLoad(acceptedFiles[0]);
		} // eslint-disable-next-line
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

	//#endregion

	//#region Component Method

	// function handleOnExcelItemAdd(values, event) {
	// 	console.log(facultiesObj);
	// 	handleOnAdd(values).then((res) => {
	// 		// remove li item if user says yes
	// 		if (res) {
	// 			const thisEle = event.target;
	// 			thisEle.closest("li").remove();
	// 		}
	// 	});
	// }

	function handleOnAdd({values, removeChild = false, event}) {
		console.log(values);
		// Trả về Promise để Form đợi tới khi người dùng chọn tùy chọn
		return new Promise((resolve) => {
			if (values["faculty-name"] !== "") {
				let facID = getFacId(values["faculty-name"]);
				values["faculty-id"] = facID;
				console.log(facultiesObj);
				// alert(values["faculty-id"] in facultiesObj);
				if (values["faculty-id"] in facultiesObj) {
					confirmAlert({
						title: "Bạn có muốn thay đổi tên khoa?",
						message: "Mã khoa này đã tồn tại",
						buttons: [
							{
								className: "confirm__cancel",
								label: "Hủy",
								onClick: () => {
									resolve(false);
								},
							},
							{
								className: "sign-out",
								label: "Thay Đổi",
								onClick: () => {
									setNewFaculty(values);
									resolve(true);
									if (removeChild) {
										const thisEle = event.target;
										thisEle.closest("li").remove();
									}
								},
							},
						],
					});
				} else {
					setNewFaculty(values);
					resolve(true);
					if (removeChild) {
						const thisEle = event.target;
						thisEle.closest("li").remove();
					}
				}
			}
		});
	}

	function handleOnModify(values) {
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
	}

	function handleOnRemove(id) {
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
	}

	async function handleExcelLoad(file) {
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
						onAdd={(event) =>
							handleOnAdd({values: item, removeChild: true, event})
						}
					/>
				))
			);
		}
		// console.error(data);
	}

	function getBorderColor(props) {
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
	}

	//#endregion

	return isLoading ? (
		<Loading />
	) : (
		<div className="mng-container">
			<div className="form-list__container">
				<div className="form__container">
					{
						// render button if excel loaded at least 1 row
						!!excelLoadedItems && (
							<Button
								style={{marginBottom: 10}}
								className="delete"
								// clear items
								onClick={() => setExcelLoadedItems()}
							>
								Hủy
							</Button>
						)
					}
					{
						// render excel loaded list items if it has at least 1 row or render dropzone_container
						!!excelLoadedItems ? (
							<ul id="excel__loaded-ul">{excelLoadedItems}</ul>
						) : (
							<>
								<div
									className="dropzone__container"
									style={{
										// expand to full height of parent
										height: (isDragActive || !!excelLoadedItems) && "100%",
										// change border color on Drag event
										borderColor: getBorderColor({
											...getRootProps({
												isDragActive,
												isDragAccept,
												isDragReject,
											}),
										}),
									}}
									// get props for root container
									{...getRootProps()}
								>
									<input {...getInputProps()} />
									{isDragActive ? (
										<p>Thả file vào đây...</p>
									) : (
										<p>
											Kéo thả tệp excel vào đây <br />
											hoặc nhấn để chọn tệp của bạn!
										</p>
									)}
								</div>
							</>
						)
					}
					{
						// remove form on file drag or if list item has item
						isDragActive || !!excelLoadedItems || (
							<FormFaculties
								{...{
									facultiesObj,
									currentFacultyId,
									setCurrentFacultyId,
									handleOnAdd,
									handleOnModify,
								}}
							/>
						)
					}
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
										onRemove={() => handleOnRemove(id)}
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
