import React from "react";
import Calendar from "react-calendar";
import PropTypes from "prop-types";

// import components
import {LinkButton} from "./Button";

// import styles
import "./LeftMenu.css";

const LeftMenu = ({
	visible,
	calendarOnChange,
	calendarValue,
	showScheduler,
}) => {
	showScheduler = !showScheduler && null;

	return (
		<>
			<div
				className={
					visible ? "left-menu show-left-menu" : "left-menu hide-left-menu"
				}
			>
				<LinkButton to="/new">
					<div>Tạo thời khóa biểu mới</div>
				</LinkButton>

				<Calendar
					onChange={calendarOnChange}
					value={calendarValue}
					className={["calendar"]}
					locale="vi-VN"
					nextLabel={<i className="fas fa-angle-right" />}
					next2Label={<i className="fas fa-angle-double-right" />}
					prevLabel={<i className="fas fa-angle-left" />}
					prev2Label={<i className="fas fa-angle-double-left" />}
				/>

				<LinkButton to="/allocate-manage">
					<div>Quản lý phân công giảng dạy</div>
				</LinkButton>

				<LinkButton to="/teacher-time-table">
					<div>Thời khóa biểu của giảng viên</div>
				</LinkButton>

				<LinkButton to="/schedule-timetable">
					<div>Chỉnh sửa thời khóa biểu</div>
				</LinkButton>
				{showScheduler && (
					<>
						<div className="board-column-header">Thứ 2</div>
						<div className="board-column-content-wrapper">
							<div className="board-column-content">
								<div class="board-item">
									<div class="board-item-content">
										<span>Item #</span>1
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
};

LeftMenu.propTypes = {
	visible: PropTypes.bool,
	calendarOnChange: PropTypes.func,
	calendarValue: PropTypes.object,
	showScheduler: PropTypes.bool,
};

export default LeftMenu;
