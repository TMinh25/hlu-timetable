import React from "react";
import logo from "../logo.svg";
import {Link} from "react-router-dom";

// import styles
import "./Logo.css";

class Logo extends React.Component {
	render() {
		if (this.props.to) {
			return (
				<Link to={this.props.to}>
					<div
						style={this.props.style}
						className="app-logo-container"
					>
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
		return (
			<div style={this.props.style} className="app-logo-container">
				<img src={logo} className="app-logo" alt="logo" />
				<p>
					Hạ Long
					<br />
					University
				</p>
			</div>
		);
	}
}

export default Logo;
