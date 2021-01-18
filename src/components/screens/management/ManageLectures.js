import React, {useEffect, useState, useContext} from "react";

// import components
import LecturesForm from "./LecturesForm";
import {
	newLecture,
	removeLecture,
	getAllLectures,
	getAllFaculties,
	userRef,
} from "../../../firebase";
import {UserContext} from "../../../providers/UserProvider";
import {confirmAlert} from "react-confirm-alert";

import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

// import styles
import "./ManageFaculties.css";

const columns = [
	{id: "faculty-id", label: "Mã Khoa", width: 100, align: "center"},
	{id: "faculty-name", label: "Tên Khoa", minWidth: 300},
	{
		id: "action",
		label: "Hành Động",
		align: "center",
	},
];

const useStyles = makeStyles({
	root: {
		width: "100%",
		height: "100%",
		overflow: "hidden",
	},
	container: {
		maxHeight: "100%",
		// maxHeight: "90%",
	},
});

const ManageLectures = () => {
	const [lecturesList, setLecturesList] = useState({});
	const [facultiesList, setFacultiesList] = useState({});
	const [currentLectureId, setCurrentLectureId] = useState();

	useEffect(() => {
		getAllLectures((result) => {
			setLecturesList(result);
			// console.log(result);
		});
		getAllFaculties((result) => {
			setFacultiesList(result);
			console.log(result);
		});
	}, []); // similar to fetching lectures list on componentDidMount()

	// const handleOnDeleleFaculty = (facID) => {
	// 	confirmAlert({
	// 		title: "Bạn có chắc muốn xóa khoa này?",
	// 		message: "Bạn sẽ không thể truy cập lại thông tin này",
	// 		buttons: [
	// 			{
	// 				className: "confirm__cancel",
	// 				label: "Hủy",
	// 			},
	// 			{
	// 				className: "sign-out",
	// 				label: "Xóa",
	// 				onClick: () => {
	// 					removeFaculty(facID);
	// 					setCurrentFacultyId("");
	// 				},
	// 			},
	// 		],
	// 	});
	// };

	// const handleOnModifyFaculty = (falcID) => {
	// 	setCurrentFacultyId(falcID);
	// };

	// const handleOnModify = (values) => {
	// 	return new Promise((resolve) => {
	// 		let id = getFacId(values["faculty-name"]);
	// 		values["faculty-id"] = id;

	// 		if (id !== currentFacultyId) {
	// 			if (values["faculty-id"] in facultiesList) {
	// 				confirmAlert({
	// 					closeOnEscape: true,
	// 					title: "Bạn có muốn thay đổi tên khoa?",
	// 					message: "Mã khoa này đã tồn tại",
	// 					buttons: [
	// 						{
	// 							className: "confirm__cancel",
	// 							label: "Hủy",
	// 							onClick: () => {
	// 								resolve();
	// 							},
	// 						},
	// 						{
	// 							className: "sign-out",
	// 							label: "Thay Đổi",
	// 							onClick: () => {
	// 								removeFaculty(currentFacultyId);
	// 								setLecture(values);
	// 								resolve(true);
	// 							},
	// 						},
	// 					],
	// 				});
	// 			} else {
	// 				setLecture(values);
	// 				resolve(true);
	// 			}
	// 		} else {
	// 			setNewFaculty(values);
	// 		}
	// 		// Đặt lại id thành null để reset Form
	// 		setCurrentFacultyId("");
	// 		resolve(true);
	// 	});
	// };

	const handleOnAdd = (values) => {
		// Trả về Promise để Form đợi tới khi người dùng chọn tùy chọn
		return new Promise((resolve) => {
			if (!!values["lecture-name"]) {
				// values["faculty-id"] = getFacId(values["faculty-name"]);
				// console.warn(values["faculty-id"]);
				// confirmAlert({
				// 	title: "Bạn có muốn thay đổi tên khoa?",
				// 	message: "Mã khoa này đã tồn tại",
				// 	buttons: [
				// 		{
				// 			className: "confirm__cancel",
				// 			label: "Hủy",
				// 			onClick: () => {
				// 				resolve();
				// 			},
				// 		},
				// 		{
				// 			className: "sign-out",
				// 			label: "Thay Đổi",
				// 			onClick: () => {
				// 				newLecture(values);
				// 				resolve(true);
				// 			},
				// 		},
				// 	],
				// });
				newLecture(values);
				resolve(true);
			}
		});
	};

	return (
		<>
			<div className="mng-container">
				{/* <h1>Quản lý các khoa tại trường học</h1> */}

				<div className="form-list__container">
					<div className="facuties-form__container">
						<LecturesForm {...{facultiesList, lecturesList, handleOnAdd}} />
					</div>
					<div className="facuties-list__container"></div>
				</div>
			</div>
		</>
	);
};

export default ManageLectures;
