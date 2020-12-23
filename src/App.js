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
import TableDragSelect from "react-table-drag-select";

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
					</Switch>
				</Router>
			</>
		);
	}
}

export default App;
