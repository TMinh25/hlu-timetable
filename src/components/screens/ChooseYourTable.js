import React, {useEffect, useState, useContext} from "react";

// import components
import {UserContext} from "../../providers/UserProvider";
import {LinkButton} from "../Button";
import {userRef} from "../../firebase";
import {Link} from "@reach/router";

// import styles
import "./ChooseYourTable.css";

const TimeTableLi = (props) => {
	return (
		<>
			<li key={props.id}>
				<Link to={`/timetable/${props.id}`}>{props.timetableName}</Link>
				<span
					onClick={props.onDelete}
					style={{
						color: "red",
						backgroundColor: "white",
						cursor: "pointer",
					}}
				>
					x
				</span>
			</li>
		</>
	);
};

const ChooseYourTable = () => {
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
					<h2>Các thời khóa biểu mà bạn đã lưu</h2>
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
												timetableName={
													semesterObject[id]["semester-info"]["user-named"]
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

export default ChooseYourTable;
