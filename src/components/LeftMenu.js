import React from "react";
import Calendar from "react-calendar";
import PropTypes from "prop-types";

// import components
import { LinkButton, DropDownHoverButton } from "./Components";

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
        className={`left-menu ${visible ? "show-left-menu" : "hide-left-menu"}`}
      >
        <LinkButton to="/timetable">
          <div>Thời khóa biểu</div>
        </LinkButton>

        <DropDownHoverButton
          children="Quản lý đào tạo"
          item1={
            <>
              Khoa <i className="fas fa-chalkboard-teacher" />
            </>
          }
          item1Link="mng-faculties"
          item2={
            <>
              Nhân sự <i className="fas fa-users" />
            </>
          }
          item2Link="mng-lectures"
          item3={
            <>
              Môn học <i className="fas fa-book" />
            </>
          }
          item3Link="mng-subjects"
        />

        <Calendar
          onChange={calendarOnChange}
          value={calendarValue}
          className={["calendar calendar__left-menu"]}
          locale="vi-VN"
          showNeighboringMonth={false}
          nextLabel={<i className="fas fa-angle-right" />}
          next2Label={<i className="fas fa-angle-double-right" />}
          prevLabel={<i className="fas fa-angle-left" />}
          prev2Label={<i className="fas fa-angle-double-left" />}
        />

        {/* <LinkButton to="/teacher-time-table">
          <div>Thời khóa biểu của giảng viên</div>
        </LinkButton>

        <LinkButton to="/schedule-timetable">
          <div>Chỉnh sửa thời khóa biểu</div>
        </LinkButton> */}

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
