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

	componentDidUpdate() {
		console.log(this.props.visible);
	}

	render() {
		return (
			<>
				<div
					className={
						this.props.visible
							? "left-menu show-left-menu"
							: "left-menu hide-left-menu"
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
						nextLabel={<i className="fas fa-angle-right" />}
						next2Label={<i className="fas fa-angle-double-right" />}
						prevLabel={<i className="fas fa-angle-left" />}
						prev2Label={<i className="fas fa-angle-double-left" />}
					/>

					<LinkButton to="/new">
						<div>Quản lý phân công giảng dạy</div>
					</LinkButton>

					<LinkButton to="/teacher-time-table">
						<div>Thời khóa biểu của giảng viên</div>
					</LinkButton>
				</div>
			</>
		);
	}
}

export default LeftMenu;
