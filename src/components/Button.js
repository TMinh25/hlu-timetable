import React, {Component} from "react";
// import {Link} from "react-router-dom";
import {Link} from "@reach/router";

// import styles
import "./Button.css";

export class LinkButton extends Component {
	render() {
		return (
			<>
				<Link to={this.props.to} className="button">
					{this.props.children}
				</Link>
			</>
		);
	}
}

export const Button = (props) => {
	return (
		<>
			<button className={`button ${props.className}`} onClick={props.onClick}>
				{props.children}
			</button>
		</>
	);
};
