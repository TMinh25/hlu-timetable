import React from "react";
import logo from "../logo.svg";
// import {Link} from "react-router-dom";
import {Link} from "@reach/router";

// import styles
import "./Logo.css";

class Logo extends React.Component {
	render() {
		return (
			<Link to="/">
				<div style={this.props.style} className="app-logo-container">
					<img src={logo} className="app-logo" alt="logo" />
					<p>
						Hạ Long
						<br />
						University
					</p>
				</div>
			</Link>
		);
	}
}

export default Logo;
