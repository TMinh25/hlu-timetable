import React, { useState, useEffect, useContext } from "react";

// import components
import { setNewSemester } from "../../firebase";
import { UserContext } from "../../providers/UserProvider";
import Calendar from "react-calendar";
import { Button } from "../Components";
import { useNavigate } from "@reach/router";
import moment from "moment";
import "moment/locale/vi";

// import styles
import "./TimeTableNew.css";

function weekCount(time1, time2) {
  const diff = time1.diff(time2, "week");
  return diff;
}

const TimeTableNew = () => {
  const currentUser = useContext(UserContext);
  const navigate = useNavigate();
  moment.locale("vi");
  moment.defaultFormat = "dddd LL";

  const [values, setValues] = useState({});

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setValues({
      userNamed:
        semName || calendarStartValue.year() + "-" + calendarEndValue.year(),
      semesterStart: calendarStartValue,
      semesterEnd: calendarEndValue,
      numberOfWeeks: weekCount(calendarEndValue, calendarStartValue),
      timeCreated: moment(),
    });
    navigate("/timetable");
  };

  useEffect(() => {
    if (Object.keys(values).length) {
      setNewSemester(values);
    }
  }, [values]);

  // start and end of semester
  const [calendarStartValue, onStartValueChange] = useState(moment());
  const [calendarEndValue, onEndValueChange] = useState(moment());

  // semester name for UX
  const [semName, setSemName] = useState("");

  return (
    <>
      {!!currentUser ? (
        <>
          <h1>Cùng nhau tạo thời khóa biểu mới!</h1>
          {/* <div>Bước đầu: Chọn thời gian mà kì học của bạn diễn ra</div> */}
          <br />
          <form onSubmit={handleOnSubmit}>
            <label>
              <span className="label__new">Tên thời khóa biểu</span>
              <input
                className="sem-name__input"
                name="sem-name"
                value={semName}
                onChange={({ target }) => setSemName(target.value)}
                placeholder="Tên kì học có thể giúp bạn dễ ghi nhớ hơn..."
              />
            </label>
            <section className="date-picker__section">
              <div className="new__date-picker">
                <div className="picker_span">
                  <span className="label__new">Ngày Bắt đầu</span>
                  <span>{calendarStartValue.format()}</span>
                </div>
                <Calendar
                  onChange={(value) => onStartValueChange(moment(value))}
                  value={new Date(calendarStartValue)}
                  className={["calendar calendar__main"]}
                  locale="vi-VN"
                  nextLabel={<i className="fas fa-angle-right" />}
                  next2Label={<i className="fas fa-angle-double-right" />}
                  prevLabel={<i className="fas fa-angle-left" />}
                  prev2Label={<i className="fas fa-angle-double-left" />}
                />
              </div>
              <span className="to-text">đến</span>
              <div className="new__date-picker">
                <div className="picker_span">
                  <span className="label__new">Ngày Kết thúc</span>
                  <span>{calendarEndValue.format()}</span>
                </div>
                <Calendar
                  onChange={(value) => onEndValueChange(moment(value))}
                  value={new Date(calendarEndValue)}
                  className={["calendar calendar__main"]}
                  locale="vi-VN"
                  nextLabel={<i className="fas fa-angle-right" />}
                  next2Label={<i className="fas fa-angle-double-right" />}
                  prevLabel={<i className="fas fa-angle-left" />}
                  prev2Label={<i className="fas fa-angle-double-left" />}
                />
              </div>
            </section>
            <Button
              style={{ marginLeft: "auto", width: "25%" }}
              className="new"
              type="submit"
              onClick={handleOnSubmit}
            >
              Tạo mới{" "}
              <i style={{ marginLeft: 10 }} className="fas fa-arrow-right" />
            </Button>
          </form>
        </>
      ) : (
        <div>Đăng nhập để tiếp tục</div>
      )}
    </>
  );
};

export default TimeTableNew;
