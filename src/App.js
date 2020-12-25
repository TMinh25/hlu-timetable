import React from "react";
import Calendar from "react-calendar";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

// import styles
import "./App.css";
import "react-calendar/dist/Calendar.css";

// import components
import Home from "./components/screens/Home";
import NewTimeTable from "./components/screens/NewTimeTable";
import TeacherTimeTable from "./components/screens/TeacherTimeTable";
import AllocateManagement from "./components/screens/AllocateManagement";
import ScheduleTimeTable from "./components/screens/ScheduleTimeTable";

class App extends React.Component {
	render() {
		return (
			<>
				<Router>
					<Switch>
						<Route name="home" path="/" exact component={Home} />
						<Route name="new" path="/new" component={NewTimeTable} />
						<Route
							name="teacher-time-table"
							path="/teacher-time-table"
							component={TeacherTimeTable}
						/>
						<Route
							name="allocate-manage"
							path="/allocate-manage"
							component={AllocateManagement}
						/>
						<Route
							name="schedule-timetable"
							path="/schedule-timetable"
							component={ScheduleTimeTable}
						/>
					</Switch>
				</Router>
			</>
		);
	}
}

export default App;
