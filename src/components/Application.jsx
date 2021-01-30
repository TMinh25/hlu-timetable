import React, {useState, useEffect} from "react";
// import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {Router} from "@reach/router";

// import styles
import "../App.css";
import "react-calendar/dist/Calendar.css";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";

// import components
import NavBar from "./NavBar";
import LeftMenu from "./LeftMenu";

// import screens
import Home from "./screens/Home";
import New from "./screens/New";
import TeacherTimeTable from "./screens/TeacherTimeTable";
import ScheduleTimeTable from "./screens/ScheduleTimeTable";
import ManageAssignments from "./screens/management/ManageAssignments";
import ManageFaculties from "./screens/management/ManageFaculties";
import ManageLecture from "./screens/management/ManageLectures";
import ManageSubjects from "./screens/management/ManageSubjects";
import TimeTables from "./screens/TimeTables";
import TimeTable from "./screens/TimeTable";
import NotFound from "./screens/NotFound";

const Application = () => {
	const [leftMenuVisible, setLeftMenuVisible] = useState(true);

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
	}, []);

	const handleHamburgerClick = () => {
		setLeftMenuVisible((prev) => !prev);
	};

	const theme = React.useMemo(
		() =>
			createMuiTheme({
				palette: {
					type: "dark",
				},
			}),
		[]
	);

	return (
		<>
			<ThemeProvider theme={theme}>
				<NavBar onHamburgerClick={handleHamburgerClick} showHamburger={true} />
				<main>
					<LeftMenu visible={leftMenuVisible} showScheduler={true} />
					<Router className="main-container">
						<Home path="/" />
						<New path="new" />
						<TeacherTimeTable path="teacher-time-table" />
						<ScheduleTimeTable path="schedule-timetable" />
						<ManageAssignments path="mng-assignments" />
						<ManageFaculties path="mng-faculties" />
						<ManageLecture path="mng-lectures" />
						<ManageSubjects path="mng-subjects" />
						<TimeTables path="timetable" />
						<TimeTable path="timetable/:timeTableId" />
						<NotFound default />
					</Router>
				</main>
			</ThemeProvider>
		</>
	);
};

export default Application;
