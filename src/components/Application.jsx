import React, { useState, useEffect, useContext } from "react";
import { Router } from "@reach/router";
import { UserContext } from "../providers/UserProvider";

// import styles
import "../App.css";
import "react-calendar/dist/Calendar.css";
// import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";

// import components
import NavBar from "./NavBar";
import LeftMenu from "./LeftMenu";

// import screens
import Home from "./screens/Homepage/Home";
import TimeTableNew from "./screens/TimeTableNew";
import TeacherTimeTable from "./screens/TeacherTimeTable";
import ScheduleTimeTable from "./screens/ScheduleTimeTable";
import ManageFaculties from "./screens/management/ManageFaculties";
import ManageLecture from "./screens/management/ManageLectures";
import ManageSubjects from "./screens/management/ManageSubjects";
import TimeTables from "./screens/TimeTables";
import TimeTable from "./screens/TimeTable";
import NotFound from "./screens/NotFound";

const Application = () => {
	const [leftMenuVisible, setLeftMenuVisible] = useState(true);
	const currentUser = useContext(UserContext);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 850) {
				setLeftMenuVisible(false);
			}
			if (window.innerWidth > 850) {
				setLeftMenuVisible(true);
			}
		};

		window.addEventListener("resize", () => {
			handleResize();
		});
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []); // hide left menu on resize window or if device width is small

	useEffect(() => {
		let numberInput = document.querySelectorAll("input[type='number']");

		numberInput.forEach((elem) => {
			elem.addEventListener("keypress", function (e) {
				if ((e.which != 0 && e.which != 8 && e.which < 48) || e.which > 57) {
					e.preventDefault();
				}
			});
		});
	}, []); // set all input with type = number can only type number

	const handleHamburgerClick = () => {
		setLeftMenuVisible((prev) => !prev);
	}; // toggle left menu

	return (
		<>
			<NavBar
				onLogoClick={() => {
					setLeftMenuVisible(false);
				}}
				onHamburgerClick={handleHamburgerClick}
				showHamburger={currentUser}
			/>
			<main>
				{currentUser && (
					<LeftMenu visible={leftMenuVisible} showScheduler={true} />
				)}
				<Router className="main-container">
					<Home path="/" />
					<TeacherTimeTable path="teacher-time-table" />
					<ScheduleTimeTable path="schedule-timetable" />
					<ManageFaculties path="mng-faculties" />
					<ManageLecture path="mng-lectures" />
					<ManageSubjects path="mng-subjects" />
					<TimeTableNew path="new-timetable" />
					<TimeTables path="timetable" {...{ setLeftMenuVisible }} />
					<TimeTable path="timetable/:timeTableId" />
					<NotFound default />
				</Router>
			</main>
		</>
	);
};

export default Application;
