import React, { useEffect, useState } from "react";

// import components
import { auth, userRef } from "../../firebase";
import NotFound from "./NotFound";
import LeftMenu from "../LeftMenu";

const TimeTable = (props) => {
	const [semester, setSemester] = useState({});

	useEffect(() => {
		if (props.timeTableId) {
			console.log(props.timeTableId);
		}
	}, [props.timeTableId]);

	useEffect(() => {
		if (!!auth.currentUser) {
			userRef(auth.currentUser.uid)
				.child(`semesters/${props.timeTableId}`)
				.on("value", (snapshot) => {
					if (snapshot.val() != null) {
						setSemester({ ...snapshot.val() });
					} else {
						setSemester({});
					}
				});
		}
	}, [auth.currentUser, props.timeTableId]); // similar to componentDidMount()

	return Object.keys(semester).length ? (
		<>
			<div>
				<h1>note: {props.timeTableId}</h1>
				<p>id: {semester["semester-info"]["user-named"]}</p>
			</div>
		</>
	) : (
		<NotFound />
	);
};

export default TimeTable;
