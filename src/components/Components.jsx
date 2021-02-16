import React, { useCallback } from "react";
import { Link } from "@reach/router";
import { defaultFailCB } from "../utils";
import { useDropzone } from "react-dropzone";

// import components
import logo from "../logo.svg";

// import styles
import "./Components.css";

//#region Logo & Loading

export const Logo = () => (
	<Link to="/">
		<div className="app-logo-container">
			<img src={logo} className="app-logo" alt="logo" />
			<p>
				Hạ Long
				<br />
				University
			</p>
		</div>
	</Link>
);

export const Loading = () => (
	<>
		<div className="loading">
			<img src={logo} className="app-logo-loading" alt="logo" />
		</div>
	</>
);

//#endregion

//#region Button

export const LinkButton = ({ className, title, to, children }) => {
	const fixedClassName = className ? className : "";
	return (
		<>
			<Link title={title} to={to} className={`button ${fixedClassName}`}>
				{children}
			</Link>
		</>
	);
};

export const Button = ({
	title,
	style,
	type,
	className,
	onClick,
	children,
}) => {
	return (
		<>
			<button
				title={title}
				style={style}
				type={type}
				className={`button ${className}`}
				onClick={onClick}
			>
				{children}
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
	title,
}) => {
	return (
		<>
			<div
				title={title}
				className="button dropdown-button"
				onClick={onMenuClick}
			>
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

//#endregion

//#region Excel Dropzone

export const FileDropzone = ({ handleDropped, excelLoadedItems }) => {
	// accepted files for react-dropzone in MIME Type
	const accept = [
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"application/vnd.ms-excel",
	];

	// handle on file drop with dropzone
	const onDrop = useCallback((acceptedFiles, fileRejections) => {
		if (!!fileRejections.length) {
			defaultFailCB("Tệp tin không phù hợp");
		} else {
			handleDropped(acceptedFiles);
		} // eslint-disable-next-line
	}, []);

	// get props
	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		accept,
		onDrop,
	});

	function getBorderColor(props) {
		if (props.isDragAccept) {
			return "#00e676";
		}
		if (props.isDragReject) {
			return "#ff1744";
		}
		if (props.isDragActive) {
			return "#2196f3";
		}
		return "#eeeeee";
	}

	return (
		<>
			<div
				className="dropzone__container"
				style={{
					// expand to full height of parent
					height: (isDragActive || !!excelLoadedItems.length) && "100%",
					// change border color on Drag event
					borderColor: getBorderColor({
						...getRootProps({
							isDragActive,
							isDragAccept,
							isDragReject,
						}),
					}),
				}}
				// get props for root container
				{...getRootProps()}
			>
				<input {...getInputProps()} />
				{isDragActive ? (
					<p>Thả file vào đây...</p>
				) : (
					<p>
						Kéo thả tệp excel vào đây <br />
						hoặc nhấn để chọn tệp của bạn!
					</p>
				)}
			</div>
		</>
	);
};

//#endregion
