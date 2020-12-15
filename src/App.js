import React from "react";
import Calendar from "react-calendar";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

// import styles
import "./App.css";
import "react-calendar/dist/Calendar.css";

// import components
import Home from "./components/screens/Home";
import NewTimeTable from "./components/screens/NewTimeTable";

class App extends React.Component {
	render() {
		return (
			<>
				<Router>
					<Switch>
						<Route name="home" path="/" exact component={Home} />
						<Route name="home" path="/new" component={NewTimeTable} />
					</Switch>
				</Router>
			</>
		);
	}
}

export default App;
