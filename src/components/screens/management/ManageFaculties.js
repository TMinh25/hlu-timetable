import React, {useEffect, useState, useContext} from "react";

// import components
import FacultiesForm from "./FacultiesForm";
import {getAllFaculties, userRef} from "../../../firebase";
import {UserContext} from "../../../providers/UserProvider";
import {confirmAlert} from "react-confirm-alert";

// import styles
import "./ManageFaculties.css";

const ManageFaculties = () => {
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

	useEffect(() => {
		console.log(facultiesList);
	}, [facultiesList]);

	const handleOnDeleleFaculty = (falcID) => {
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
						userRef(currentUser.uid)
							.child(`faculties/${falcID}`)
							.remove((err) => {
								if (err) {
									console.warn("failed to remove: " + err);
								}
							});
					},
				},
			],
		});
	};

	const handleOnModifyFaculty = (falcID) => {
		setCurrentFacultyId(falcID);
	};

	return (
		<div className="mng-container">
			<h1>Quản lý các khoa tại trường học</h1>
			<div className="form-list__container">
				<div className="facuties-form__container">
					<FacultiesForm {...{facultiesList, currentFacultyId}} />
				</div>
				<div className="facuties-list__container">
					{!!Object.keys(facultiesList).length && (
						<table className="faculties-list__table">
							<thead>
								<tr>
									<td>Mã Khoa</td>
									<td>Tên Khoa</td>
									<td>Hành động</td>
								</tr>
							</thead>
							<tbody>
								{Object.keys(facultiesList).map((id) => {
									return (
										<tr key={id}>
											<td>{id}</td>
											<td>{facultiesList[id]["faculty-name"]}</td>
											<td className="action__td">
												<span onClick={() => handleOnModifyFaculty(id)}>
													<i className="fas fa-pen" />
												</span>
												<span onClick={() => handleOnDeleleFaculty(id)}>
													<i className="fas fa-trash-alt" />
												</span>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</div>
	);
};

export default ManageFaculties;
