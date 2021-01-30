import React, {useEffect, useState, useContext} from "react";

// import components
import FormFaculties from "./FormFaculties";
import {getAllFaculties, setNewFaculty, removeFaculty} from "../../../firebase";
import {UserContext} from "../../../providers/UserProvider";
import {confirmAlert} from "react-confirm-alert";
import Loading from "../../Loading";

import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
// import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";

// import styles
import "./Manage.css";

const getFacId = (facName) => {
	return facName
		.trim()
		.split(" ")
		.map((word) => {
			return word[0].toUpperCase();
		})
		.join("");
};

const FacultyListItem = ({index, id, facultyName, onClick, onRemove}) => {
	return (
		<li key={index} className="list__container-li_item" onClick={onClick}>
			<p className="li__item-search">{id}</p>
			<p className="li__item-search">{facultyName}</p>
			<span className="btn__trash" onClick={onRemove}>
				<i className="fas fa-trash-alt" />
			</span>
		</li>
	);
};

const ManageFaculties = () => {
	//#region Component State

	const [isLoading, setIsLoading] = useState(true);
	const [facultiesObj, setFacultiesObj] = useState({});
	const [currentFacultyId, setCurrentFacultyId] = useState();
	const [searchString, setSearchString] = useState("");

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

	//#endregion

	//#region Component Method

	const handleOnAdd = (values) => {
		// Trả về Promise để Form đợi tới khi người dùng chọn tùy chọn
		return new Promise((resolve) => {
			if (!!values["faculty-name"]) {
				values["faculty-id"] = getFacId(values["faculty-name"]);
				console.warn(values["faculty-id"]);
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
									resolve(true);
								},
							},
						],
					});
				} else {
					setNewFaculty(values);
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

	//#endregion

	return isLoading ? (
		<Loading />
	) : (
		<div className="mng-container">
			<div className="form-list__container">
				<div className="facuties-form__container">
					<FormFaculties
						{...{
							facultiesList: facultiesObj,
							currentFacultyId,
							setCurrentFacultyId,
							handleOnAdd,
							handleOnModify,
						}}
					/>
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
							<h5>Mã khoa</h5>
							<h5>Tên khoa</h5>
						</div>
					</div>
					{!!Object.keys(facultiesObj).length ? (
						<ul>
							{Object.keys(facultiesObj)
								.reverse()
								.map((id, index) => {
									return (
										<FacultyListItem
											index={index}
											id={id}
											facultyName={facultiesObj[id]["faculty-name"]}
											onClick={() => setCurrentFacultyId(id)}
											onRemove={() => onRemove(id)}
										/>
									);
								})}
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
