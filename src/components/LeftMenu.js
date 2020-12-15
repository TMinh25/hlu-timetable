import React from "react";
import Calendar from "react-calendar";

// import components
import {LinkButton} from "./Button";

// import styles
import "./LeftMenu.css";

class LeftMenu extends React.Component {
	constructor(props) {
		super(props);
		this.handleOnCreateClick = this.handleOnCreateClick.bind(this);
	}

	handleOnCreateClick() {}

	render() {
		return (
			<>
				<div
					className={
						this.props.visible ? "left-menu" : "left-menu hide-left-menu"
					}
				>
					<LinkButton to="/new">
						<div>Tạo thời khóa biểu mới</div>
					</LinkButton>

					<Calendar
						onChange={this.props.calendarOnChange}
						value={this.props.calendarValue}
						className={["calendar"]}
						locale="vi-VN"
						nextLabel={<i class="fas fa-angle-right" />}
						next2Label={<i class="fas fa-angle-double-right" />}
						prevLabel={<i class="fas fa-angle-left" />}
						prev2Label={<i class="fas fa-angle-double-left" />}
					/>
				</div>
			</>
		);
	}
}

export default LeftMenu;
