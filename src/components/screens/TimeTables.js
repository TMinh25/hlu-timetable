import React, {useEffect, useState, useContext} from "react";

// import components
import {UserContext} from "../../providers/UserProvider";
import {LinkButton, Button} from "../Button";
import {userRef} from "../../firebase";
import {Link} from "@reach/router";
import {confirmAlert} from "react-confirm-alert";

// import styles
import "./TimeTables.css";
import "react-confirm-alert/src/react-confirm-alert.css";

const TimeTableLi = ({id, name, time, onDelete}) => {
	const getTimeString = (t) => {
		const time = new Date(t);
		const today = new Date();
		let date = "";
		if (
			time.getDate() === today.getDate() &&
			time.getMonth() === today.getMonth() &&
			time.getFullYear() === today.getFullYear()
		) {
			date = "Hôm nay";
		} else {
			date = time.toLocaleDateString();
		}
		return `${date}, ${time.getHours()}:${
			(time.getMinutes() < 10 ? "0" : "") + time.getMinutes()
		}`;
	};

	return (
		<>
			<li key={id} className="timetable__li">
				<div className="content__li-container">
					<Link to={`/timetable/${id}`} className="timetable__li-link">
						<div className="li__name">
							<i className="fas fa-table" /> {name}
						</div>
						<div className="li__time">
							<i className="far fa-clock" /> {getTimeString(time)}
						</div>
					</Link>
				</div>
					<Button title="Xóa" onClick={onDelete} className="sign-out btn__li">
						<i className="fas fa-times" />
					</Button>
			</li>
		</>
	);
};

const TimeTables = () => {
	const currentUser = useContext(UserContext);

	const [semesterObject, setSemesterObject] = useState({});

	useEffect(() => {
		if (!!currentUser) {
			userRef(currentUser.uid)
				.child("semesters")
				.on("value", (snapshot) => {
					if (snapshot.val() != null) {
						setSemesterObject({...snapshot.val()});
					} else {
						setSemesterObject({});
					}
				});
		}
	}, [currentUser]); // similar to componentDidMount()

	const handleOnDelete = (semID) => {
		confirmAlert({
			title: "Xóa thời khóa biểu này?",
			message: "Bạn sẽ không thể truy cập lại thời khóa biểu này",
			buttons: [
				{
					className: "confirm__cancel",
					label: "Hủy",
					// onClick: () => alert("Click No"),
				},
				{
					className: "sign-out",
					label: "Xóa",
					onClick: () => {
						userRef(currentUser.uid)
							.child(`semesters/${semID}`)
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

	return (
		<>
			<div className="choose">
				<div className="choose__header">
					<h1>Các thời khóa biểu mà bạn đã lưu</h1>
					<LinkButton to="/new" className="new choose__new">
						Tạo mới
					</LinkButton>
				</div>
				<div className="choose__main">
					{!!Object.keys(semesterObject).length ? (
						<>
							<ul>
								{Object.keys(semesterObject)
									.reverse()
									.map((id) => {
										return (
											<>
												<TimeTableLi
													id={id}
													onDelete={() => handleOnDelete(id)}
													name={
														semesterObject[id]["semester-info"]["user-named"]
													}
													time={
														semesterObject[id]["semester-info"]["time-created"]
													}
												/>
											</>
										);
									})}
							</ul>
						</>
					) : (
						<>
							<h3 className="center-text">
								Bạn chưa có thời khóa biểu nào, hãy tạo mới nhé!
							</h3>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default TimeTables;
