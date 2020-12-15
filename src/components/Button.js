import React from "react";
import {Link} from "react-router-dom";

// import styles
import "./Button.css";

export class LinkButton extends React.Component {
	render() {
		return (
			<>
				<Link to={this.props.to} className="link-button">
					{this.props.children}
				</Link>
			</>
		);
	}
}
