import React, { useEffect, useState } from "react";

// import components
import { Loading, LinkButton, Button } from "../Components";
import { removeSemester, getAllSemester } from "../../firebase";
import { Link } from "@reach/router";
import { confirmAlert } from "react-confirm-alert";
import PropTypes from "prop-types";

// import styles
import "./TimeTables.css";
import "react-confirm-alert/src/react-confirm-alert.css";

function getTimeString(t) {
  const time = new Date(t);
  const today = new Date();
  let date = "";
  if (
    time.getDate() === today.getDate() &&
    time.getMonth() === today.getMonth() &&
    time.getFullYear() === today.getFullYear()
  ) {
    date = "Hôm nay";
  } else {
    date = time.toLocaleDateString("vi-VN");
  }
  return `${date}, ${time.getHours()}:${
    (time.getMinutes() < 10 ? "0" : "") + time.getMinutes()
  }`;
}

const TimeTableListItem = (props) => {
  const { id, value, onDelete, onClick } = props;

  const { userNamed, timeCreated, numberOfWeeks } = value["semesterInfo"];
  let title = `${userNamed}\nSố tuần học: ${numberOfWeeks}`;

  const restProps = { title, onClick };

  return (
    <li className="timetable__li" {...restProps}>
      <div className="content__li-container">
        <Link to={`/timetable/${id}`} className="timetable__li-link">
          <div className="li__name">✌ {userNamed}</div>
          <div className="li__time" style={{ fontSize: "1.8vmin" }}>
            <i className="far fa-clock" /> {getTimeString(timeCreated)}
          </div>
        </Link>
      </div>
      <Button title="Xóa" onClick={onDelete} className="sign-out btn__li">
        <i class="far fa-trash" />
      </Button>
    </li>
  );
};

TimeTableListItem.propTypes = {
  id: PropTypes.string,
  value: PropTypes.shape({
    userNamed: PropTypes.string,
    timeCreated: PropTypes.instanceOf(Date),
    numberOfWeeks: PropTypes.string,
  }),
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
};

const TimeTables = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [semesterObject, setSemesterObject] = useState({});

  useEffect(() => {
    getAllSemester((result) => {
      setSemesterObject(result);
      setIsLoading(false);
    });
  }, [isLoading]); // fetching data from firebase

  const handleOnDelete = (semID) => {
    confirmAlert({
      title: "Xóa thời khóa biểu này?",
      message: "Bạn sẽ không thể truy cập lại thời khóa biểu này",
      buttons: [
        {
          className: "confirm__cancel",
          label: "Hủy",
          // onClick: () => alert("Click No"),
        },
        {
          className: "sign-out",
          label: "Xóa",
          onClick: () => {
            removeSemester(semID);
          },
        },
      ],
    });
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="choose__container">
          <div className="choose__header">
            <h1>Các thời khóa biểu mà bạn đã lưu</h1>
            <LinkButton to="/new-timetable" className="new choose__new">
              Tạo mới
            </LinkButton>
          </div>
          <div className="choose__main">
            {!!Object.keys(semesterObject).length ? (
              <ul>
                {Object.keys(semesterObject)
                  .reverse()
                  .map((id, index) => (
                    <TimeTableListItem
                      key={index}
                      id={id}
                      onDelete={() => handleOnDelete(id)}
                      value={semesterObject[id]}
                      onClickLi={() => props.setLeftMenuVisible(false)}
                    />
                  ))}
              </ul>
            ) : (
              <h3 className="center-text">
                Bạn chưa có thời khóa biểu nào, hãy tạo mới nhé!
              </h3>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TimeTables;
