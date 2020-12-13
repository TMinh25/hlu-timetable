import React from "react";
import logo from "../logo.svg";
import "./Logo.css";

class Logo extends React.Component {
	render() {
		return (
			<>
				<div className="app-logo-container">
					<img src={logo} className="app-logo" alt="logo" />
					<p>
						Hạ Long
						<br />
						University
					</p>
				</div>
			</>
		);
	}
}

export default Logo;
