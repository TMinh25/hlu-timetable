import React, {Component, useState} from "react";
// import {Link} from "react-router-dom";
import {Link} from "@reach/router";

// import styles
import "./Button.css";

export const LinkButton = (props) => {
	return (
		<>
			<Link to={props.to} className="button">
				{props.children}
			</Link>
		</>
	);
};

export const Button = (props) => {
	return (
		<>
			<button className={`button ${props.className}`} onClick={props.onClick}>
				{props.children}
			</button>
		</>
	);
};

export const DropDownHoverButton = ({
	children,
	onMenuClick,
	item1,
	item1Link,
	item2,
	item2Link,
	item3,
	item3Link,
	item4,
	item4Link,
	item5,
	item5Link,
}) => {
	return (
		<>
			<div className="button dropdown-button" onClick={onMenuClick}>
				{children}
				<ul className="dropdown_menu">
					{item1 && item1Link && (
						<Link to={item1Link}>
							<li className="dropdown_item dropdown_item-1">{item1}</li>
						</Link>
					)}
					{item2 && item2Link && (
						<Link to={item2Link}>
							<li className="dropdown_item dropdown_item-2">{item2}</li>
						</Link>
					)}
					{item3 && item3Link && (
						<Link to={item3Link}>
							<li className="dropdown_item dropdown_item-3">{item3}</li>
						</Link>
					)}
					{item4 && item4Link && (
						<Link to={item4Link}>
							<li className="dropdown_item dropdown_item-4">{item4}</li>
						</Link>
					)}
					{item5 && item5Link && (
						<Link to={item5Link}>
							<li className="dropdown_item dropdown_item-5">{item5}</li>
						</Link>
					)}
				</ul>
			</div>
		</>
	);
};
