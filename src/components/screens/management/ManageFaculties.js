import React, {useEffect, useState, useContext} from "react";

// import components
import FacultiesForm from "./FacultiesForm";
import {getAllFaculties, userRef} from "../../../firebase";
import {UserContext} from "../../../providers/UserProvider";

// import styles
import "./ManageFaculties.css";

const ManageFaculties = () => {
	const currentUser = useContext(UserContext);
	const [facultiesList, setFacultiesList] = useState({});

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
		console.log(Object.keys(facultiesList));
	}, [facultiesList]);

	return (
		<div className="mng-container">
			<h1>Quản lý các khoa tại trường học</h1>
			<div className="form-list__container">
				<div className="facuties-form__container">
					<FacultiesForm {...{}} />
				</div>
				<div className="facuties-list__container">
					{!!Object.keys(facultiesList).length && (
						<ul>
							{Object.keys(facultiesList).map((id) => {
								return (
									<li key={id}>
										{id + " " + facultiesList[id]["faculty-name"]}
									</li>
								);
							})}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default ManageFaculties;
