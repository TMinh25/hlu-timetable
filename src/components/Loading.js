import React from "react";
import logo from "../logo.svg";
import "./Logo.css";

class Loading extends React.Component {
	render() {
		return (
			<>
				<div className="loading">
						<img src={logo} className="app-logo-loading" alt="logo" />
				</div>
			</>
		);
	}
}

export default Loading;