import React, {useEffect, useState, useContext} from "react";

// import components
import {UserContext} from "../../providers/UserProvider";
import {LinkButton, Button} from "../Button";
import {userRef} from "../../firebase";
import {Link} from "@reach/router";

// import styles
import "./TimeTables.css";

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
		return `${date}, ${time.getHours()}:${time.getMinutes()}`;
	};

	return (
		<>
			<li key={id} className="timetable__li">
				<Link to={`${id}`} className="timetable__li-link">
					<div className="li__name">
						<i className="fas fa-table" /> {name}
					</div>
					<div className="li__time">
						<i className="far fa-clock" /> {getTimeString(time)}
					</div>
				</Link>
				<Button onClick={onDelete} className="sign-out delete-btn__li">x</Button>
				{/* <span onClick={onDelete} className="delete-btn__li center-text"></span> */}
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
				.child("semester")
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
		userRef(currentUser.uid)
			.child(`semester/${semID}`)
			.remove((err) => {
				if (err) {
					console.warn("failed to remove: " + err);
				}
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
								{Object.keys(semesterObject).map((id) => {
									return (
										<>
											<TimeTableLi
												id={id}
												onDelete={() => handleOnDelete(id)}
												name={semesterObject[id]["semester-info"]["user-named"]}
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
