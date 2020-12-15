import React from "react";
import logo from "../logo.svg";
import "./Logo.css";

class Loading extends React.Component {
	render() {
		return (
			<>
				<div className="App">
					<header className="App-header">
						<img src={logo} className="app-logo-loading" alt="logo" />
					</header>
				</div>
			</>
		);
	}
}

export default Loading;