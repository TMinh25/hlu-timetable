import React from "react";
// import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {Router} from "@reach/router";

// import styles
import "../App.css";
import "react-calendar/dist/Calendar.css";

// import components
import NavBar from "./NavBar";
import LeftMenu from "./LeftMenu";

import Home from "./screens/Home";
import NewTimeTable from "./screens/NewTimeTable";
import TeacherTimeTable from "./screens/TeacherTimeTable";
import ScheduleTimeTable from "./screens/ScheduleTimeTable";
import ManageAssignments from "./screens/management/ManageAssignments";
import ManageFacultiesClasses from "./screens/management/ManageFacultiesClasses";
import ManageLecture from "./screens/management/ManageLectures";
import ManageSubjects from "./screens/management/ManageSubjects";
import NotFound from "./screens/NotFound";

const Application = () => {
	const [leftMenuVisible, setLeftMenuVisible] = React.useState(true);

	const handleHamburgerClick = () => {
		setLeftMenuVisible((prev) => !prev);
	};

	return (
		<>
			<NavBar onHamburgerClick={handleHamburgerClick} showHamburger={true} />
			<main>
				<LeftMenu visible={leftMenuVisible} showScheduler={true} />
				<Router className="main-container">
					<Home path="/" />
					<NewTimeTable path="new" />
					<TeacherTimeTable path="teacher-time-table" />
					<ScheduleTimeTable path="schedule-timetable" />
					<ManageAssignments path="mng-assignments" />
					<ManageFacultiesClasses path="mng-faculties-classes" />
					<ManageLecture path="mng-lectures" />
					<ManageSubjects path="mng-subjects" />
					<NotFound default />
				</Router>
			</main>
		</>
	);
};

export default Application;
