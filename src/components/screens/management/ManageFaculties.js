import React, {useEffect, useState, useContext} from "react";

// import components
import FacultiesForm from "./FacultiesForm";
import {setNewFaculty, removeFaculty, userRef} from "../../../firebase";
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

const getFacId = (facName) => {
	return facName
		.trim()
		.split(" ")
		.map((word) => {
			return word[0].toUpperCase();
		})
		.join("");
};

const columns = [
	{id: "faculty-id", label: "Mã Khoa", width: 100, align: "center"},
	{id: "faculty-name", label: "Tên Khoa", minWidth: 300},
	{
		id: "action",
		label: "Hành Động",
		width: 80,
		align: "center",
	},
];

const useStyles = makeStyles({
	root: {
		width: "100%",
		overflow: "hidden",
	},
	container: {
		maxHeight: "100%",
	},
});

const ManageFaculties = () => {
	const classes = useStyles();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const currentUser = useContext(UserContext);
	const [facultiesList, setFacultiesList] = useState({});
	const [currentFacultyId, setCurrentFacultyId] = useState();

	useEffect(() => {
		if (!!currentUser) {
			userRef(currentUser.uid)
				.child("faculties")
				.on("value", (snapshot) => {
					if (snapshot.val() != null) {
						setFacultiesList({...snapshot.val()});
					} else {
						setFacultiesList({});
					}
					console.log(snapshot.val());
				});
		}
	}, [currentUser]); // similar to fetching faculties list on componentDidMount()

	const handleOnDeleleFaculty = (facID) => {
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
					onClick: () => removeFaculty(facID),
				},
			],
		});
	};

	const handleOnModifyFaculty = (falcID) => {
		setCurrentFacultyId(falcID);
	};

	const handleOnModify = (values) => {
		return new Promise((resolve) => {
			let id = getFacId(values["faculty-name"]);
			values["faculty-id"] = id;

			if (id !== currentFacultyId) {
				if (values["faculty-id"] in facultiesList) {
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

	const handleOnAdd = (values) => {
		// Trả về Promise để Form đợi tới khi người dùng chọn tùy chọn
		return new Promise((resolve) => {
			if (!!values["faculty-name"]) {
				values["faculty-id"] = getFacId(values["faculty-name"]);
				console.warn(values["faculty-id"]);
				if (values["faculty-id"] in facultiesList) {
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

	return (
		<div className="mng-container">
			<h1>Quản lý các khoa tại trường học</h1>
			<div className="form-list__container">
				<div className="facuties-form__container">
					<FacultiesForm
						{...{
							facultiesList,
							currentFacultyId,
							setCurrentFacultyId,
							handleOnAdd,
							handleOnModify,
						}}
					/>
				</div>
				<div className="facuties-list__container">
					{!!Object.keys(facultiesList).length && (
						<>
							<Paper className={classes.root}>
								<TableContainer className={classes.container}>
									<Table
										stickyHeader
										aria-label="sticky table"
										striped
										bordered
										hover
										variant="dark"
									>
										<TableHead>
											<TableRow>
												{columns.map((column) => (
													<TableCell
														key={column.id}
														align={column.align}
														style={{
															minWidth: column.minWidth,
															width: column.width,
														}}
													>
														{column.label}
													</TableCell>
												))}
											</TableRow>
										</TableHead>
										<TableBody>
											{Object.keys(facultiesList)
												.slice(
													page * rowsPerPage,
													page * rowsPerPage + rowsPerPage
												)
												.map((id) => {
													return (
														<TableRow
															key={id}
															className=""
															hover
															role="checkbox"
															tabIndex={-1}
															onClick={() => handleOnModifyFaculty(id)}
														>
															<TableCell
																key={id}
																// align={column.align}
															>
																{id}
															</TableCell>
															<TableCell
																key={id}
																// align={column.align}
															>
																{facultiesList[id]["faculty-name"]}
															</TableCell>
															<TableCell
																key={id}
																className="action__td"
																align="center"
															>
																<span onClick={() => handleOnDeleleFaculty(id)}>
																	<i className="fas fa-trash-alt" />
																</span>
															</TableCell>
														</TableRow>
													);
												})}
										</TableBody>
									</Table>
								</TableContainer>
								<TablePagination
									rowsPerPageOptions={[10, 25, 100]}
									component="div"
									count={Object.keys(facultiesList).length}
									rowsPerPage={rowsPerPage}
									page={page}
									onChangePage={handleChangePage}
									onChangeRowsPerPage={handleChangeRowsPerPage}
								/>
							</Paper>{" "}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ManageFaculties;
