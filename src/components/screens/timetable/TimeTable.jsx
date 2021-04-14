import React, { useState, useContext, useEffect, useCallback } from "react";
// import components
import NotFound from "../NotFound";
import { Router, Link } from "@reach/router";
import Select from "react-select";
import { SemProvider, SemContext } from "./provider/SemProvider";

// import styles
import "./styles.css";
import {
  defaultSuccessCB,
  exists,
  getEndTime,
  getEndTimeSlot,
  getStartTime,
  getStartTimeSlot,
  isValidTimeSlot,
} from "../../../utils";
import { Button, LinkButton, Loading } from "../../Components";
import ManageClass from "../management/ManageClass";
import ManageAssignments from "../management/ManageAssigments";
import {
  getAllClasses,
  getAllLectures,
  getAssignmentsOfClass,
  getAssignmentsOfLecture,
  getClass,
  getClassScheduleArray,
  getLecture,
  getLectureScheduleArray,
  setScheduleArray,
} from "../../../firebase";
import { Popup } from "semantic-ui-react";
import moment from "moment";
import "moment/locale/vi";
import Paper from "@material-ui/core/Paper";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  DragDropProvider,
  Toolbar,
  DateNavigator,
  TodayButton,
  EditRecurrenceMenu,
} from "@devexpress/dx-react-scheduler-material-ui";
import { confirmAlert } from "react-confirm-alert";
import { TaskLimiter } from "./AppointmentLimiter";
import { Backdrop, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import classNames from "clsx";

const style = ({ palette }) => ({
  grid: {
    paddingBottom: 12,
  },
  textCenter: {
    textAlign: "center",
  },
  header: {
    height: "260px",
    backgroundSize: "cover",
  },
});

const TimeTableScheduler = (props) => {
  moment.locale("vi");
  const context = useContext(SemContext);
  const { groupedOptions, semesterInfo } = context;

  const [isLoading, setIsLoading] = useState(true);
  const [currentTimeTable, setCurrentTimeTable] = useState({});
  const [currentTimetableInfo, setCurrentTimetableInfo] = useState(null);
  const [assignmentsArr, setAssignmentsArr] = useState([]);
  const [addedAppointment, setAddedAppointment] = useState({});
  const [currentDateViewState, setCurrentDateViewState] = useState(null);
  const [classObj, setClassObj] = useState({});
  const [lectureObj, setLectureObj] = useState({});

  const [data, setData] = useState([]);

  const getTimetableInfo = useCallback(async function (timetableID) {
    const [allClasses, allLectures] = await Promise.all([
      getAllClasses(props.semId),
      getAllLectures(),
    ]);

    if (Object.keys(allClasses).includes(timetableID)) {
      return await getClass(props.semId, timetableID);
    } else if (Object.keys(allLectures).includes(timetableID)) {
      return await getLecture(timetableID);
    } else return {};

    //eslint-disable-next-line
  }, []);

  const getAssignments = useCallback(async function (timetableID) {
    const [allClasses, allLectures] = await Promise.all([
      getAllClasses(props.semId),
      getAllLectures(),
    ]);

    if (Object.keys(allClasses).includes(timetableID)) {
      // get assignments of class
      return await getAssignmentsOfClass(props.semId, timetableID);
    } else if (Object.keys(allLectures).includes(timetableID)) {
      // get assignments of lecture
      return await getAssignmentsOfLecture(props.semId, timetableID);
    } else return [];

    //eslint-disable-next-line
  }, []);

  const getSchedule = useCallback(async function (timetableID) {
    const [allClasses, allLectures] = await Promise.all([
      getAllClasses(props.semId),
      getAllLectures(),
    ]);

    if (Object.keys(allClasses).includes(timetableID)) {
      // get assignments of class
      return await getClassScheduleArray(props.semId, timetableID);
    } else if (Object.keys(allLectures).includes(timetableID)) {
      // get assignments of lecture
      // return await getAssignmentsOfLecture(props.semId, timetableID);
      return await getLectureScheduleArray(props.semId, timetableID);
    } else return [];

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timetableID = currentTimeTable?.value;

    if (exists(currentTimeTable?.value) || isLoading === true) {
      getAssignments(timetableID).then((res) => {
        setAssignmentsArr(res);
      });
      getTimetableInfo(timetableID).then((res) => {
        setCurrentTimetableInfo(res);
      });
      getSchedule(timetableID).then((res) => {
        setData(res);
      });
      getAllClasses(props.semId).then((res) => setClassObj(res));
      getAllLectures().then((res) => setLectureObj(res));
    } else {
      setAssignmentsArr([]);
      setCurrentTimetableInfo({});
      setData([]);
    }
    setIsLoading(false);

    // eslint-disable-next-line
  }, [currentTimeTable?.value, isLoading]); // get assignments list of class or lecture

  useEffect(() => {
    console.log(currentTimeTable);

    // getClassSchedulerArray(props.semId, currentTimeTable?.value).then((res) => {
    //   setData(res);
    //   console.log("classSchedule", res);
    // });

    // eslint-disable-next-line
  }, [currentTimeTable?.value]);

  useEffect(() => {
    console.log("semInfo", "=>", semesterInfo);
  }, [semesterInfo]);

  useEffect(() => {
    console.log("assignment", " => ", assignmentsArr);
  }, [assignmentsArr]);

  const onCommitChanges = useCallback(
    ({ added, changed, deleted }) => {
      if (added) {
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        added = {
          ...added,
          startDate: added?.startDate.toString(),
          endDate: added?.endDate.toString(),
        };
        const result = [...data, { id: startingAddedId, ...added }];
        setData(result);
        setScheduleArray(props.semId, currentTimeTable?.value, result);
      }
      if (changed) {
        const result = data.map((appointment) => {
          // đổi startDate với endDate về dạng string để lưu vào firebase
          if (exists(changed[appointment.id])) {
            console.log(changed);
            if (
              "startDate" in changed[appointment.id] ||
              "endDate" in changed[appointment.id]
            ) {
              changed[appointment.id]["startDate"] = changed[appointment.id][
                "startDate"
              ].toString();
              changed[appointment.id]["endDate"] = changed[appointment.id][
                "endDate"
              ].toString();
              const assignmentData = data[appointment.id]?.data;
              const numberOfClassPerWeek =
                getEndTimeSlot(changed[appointment.id]["endDate"]) -
                getStartTimeSlot(changed[appointment.id]["startDate"]) +
                1;
              const weekCount =
                semesterInfo?.numberOfWeeks / numberOfClassPerWeek;
              changed[appointment.id]["data"] = {
                ...assignmentData,
                numberOfClassPerWeek,
                weekCount,
              };
            }
          }

          console.log(changed);
          return changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment;
        });
        setData(result);
        setScheduleArray(props.semId, currentTimeTable?.value, result);
      }
      if (deleted !== undefined) {
        confirmAlert({
          title: "Bạn có muốn xóa học phần này?",
          buttons: [
            {
              label: "Không",
            },
            {
              label: "Xóa",
              className: "sign-out",
              onClick: () => {
                const result = data.filter(
                  (appointment) => appointment.id !== deleted
                );
                setData(result);
                setScheduleArray(props.semId, currentTimeTable?.value, result);
                defaultSuccessCB();
              },
            },
          ],
        });
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setData, data, currentTimeTable?.value]
  );

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  async function populateAssignment({
    index,
    assignment,
    lectureSchedule,
    classSchedule,
  }) {
    const { numberOfClassPerWeek, subjectName, weekCount } = assignment;

    return new Promise((resolve) => {
      dayLoop: for (let day = 0; day < 6; day++) {
        // eslint-disable-next-line no-loop-func
        const isValidScheduleForClass = (startDate, endDate) => {
          return classSchedule.every((item) =>
            isValidTimeSlot(startDate, endDate, item?.startDate, item?.endDate)
          );
        };
        // eslint-disable-next-line no-loop-func
        const isValidScheduleForLecture = (startDate, endDate) => {
          return lectureSchedule.every((item) =>
            isValidTimeSlot(startDate, endDate, item?.startDate, item?.endDate)
          );
        };

        timeSlotLoop: for (var startSlot = 1; startSlot < 10; startSlot++) {
          let endSlot = startSlot + numberOfClassPerWeek - 1;

          let startDate = new Date(
            getStartTime(semesterInfo?.semesterStart, startSlot).set(
              "weekday",
              day
            )
          );
          let endDate = new Date(
            getEndTime(semesterInfo?.semesterStart, endSlot).set("weekday", day)
          );

          if (
            isValidScheduleForClass(startDate, endDate) &&
            isValidScheduleForLecture(startDate, endDate)
          ) {
            resolve({
              title: subjectName,
              data: assignment,
              id: index,
              startDate: startDate.toString(),
              endDate: endDate.toString(),
              rRule: "FREQ=WEEKLY;COUNT=" + weekCount,
            });
          }
        }
      }
    });
  }

  async function handlePopulatedTimeTable() {
    const timeTableID = currentTimeTable?.value;
    if (timeTableID in classObj && assignmentsArr?.length) {
      let classSchedule = [];

      for (const [index, assignment] of assignmentsArr.entries()) {
        // console.log(index, assignment);
        const { lectureTeaching } = assignment;

        // phân công giảng dạy của giảng viên hiện tại để tránh trùng giờ
        const lectureSchedule = await getLectureScheduleArray(
          props.semId,
          lectureTeaching
        );

        const resultSchedule = await populateAssignment({
          index,
          assignment,
          lectureSchedule,
          classSchedule,
        });
        console.log(resultSchedule);
        classSchedule.push(resultSchedule);
      }

      console.log(classSchedule);
      setScheduleArray(props.semId, timeTableID, classSchedule).then((res) =>
        setData(res)
      );
    }
  }

  const allowDrag = (params) => currentTimeTable?.value in classObj;

  const allowResize = (params) => false;

  const appointmentComponent = (props) => {
    if (allowDrag(props.data)) {
      return <Appointments.Appointment {...props} />;
    }
    return (
      <Appointments.Appointment
        {...props}
        style={{ ...props.style, cursor: "not-allowed" }}
      />
    );
  };

  const Content = withStyles(style, { name: "Content" })(
    ({ children, appointmentData, classes, ...restProps }) => {
      const lectureName =
          lectureObj[appointmentData.data?.lectureTeaching]["lecture-name"],
        className = appointmentData?.data?.classTeaching?.className;

      return (
        <AppointmentTooltip.Content
          {...restProps}
          appointmentData={appointmentData}
        >
          <Grid className={classes.grid} container alignItems="center">
            <Grid item xs={2} className={classes.textCenter}>
              <i class="fad fa-users-class"></i>
            </Grid>
            <Grid item xs={10}>
              <span>{className}</span>
            </Grid>
          </Grid>
          <Grid className={classes.grid} container alignItems="center">
            <Grid item xs={2} className={classes.textCenter}>
              <i class="fad fa-user-tie"></i>
            </Grid>
            <Grid item xs={10}>
              <span>{lectureName}</span>
            </Grid>
          </Grid>
        </AppointmentTooltip.Content>
      );
    }
  );

  const CommandButton = withStyles(style, {
    name: "CommandButton",
  })(({ classes, ...restProps }) => (
    <AppointmentTooltip.CommandButton {...restProps} />
  ));

  const recurrenceEditMenu = {
    current: "Tuần hiện tại",
    currentAndFollowing: "Tuần hiện tại và các tuần sau này",
    all: "Tất cả các tuần học",
    cancelButton: "Hủy",
    commitButton: "Xác nhận",
    menuEditingTitle: "Chỉnh sửa tiết học",
    menuDeletingTitle: "Xóa tiết học",
  };

  return isLoading ? (
    <Loading />
  ) : (
    <>
      {exists(context) && (
        <div style={{ height: "100%" }}>
          <header style={{ display: "flex", marginBottom: 10 }}>
            {exists(groupedOptions) && (
              <Select
                className="basic-single"
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                name="timetable-id"
                onChange={setCurrentTimeTable}
                options={groupedOptions}
                placeholder="Thời Khóa Biểu"
                styles={{
                  container: (provided) => ({
                    ...provided,
                    zIndex: 100,
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    color: state.isSelected ? "darkgray" : "black",
                  }),
                  control: (provided) => ({
                    ...provided,
                    width: 500,
                    maxHeight: 400,
                    marginRight: 10,
                    overFlow: "hidden",
                  }),
                }}
              />
            )}
            <h1 style={{ marginRight: 10 }}>
              <Popup
                trigger={
                  <span style={{ cursor: "pointer", fontSize: 16 }}>
                    <i className="fal fa-info-circle"></i>
                  </span>
                }
                style={{
                  border: "1px solid whitesmoke",
                  background: "#263238",
                  padding: 10,
                  borderRadius: 5,
                  zIndex: 20,
                }}
                position="bottom left"
              >
                <Popup.Header>
                  <h5>
                    {!currentTimeTable?.value
                      ? "Thông tin lớp hoặc giảng viên"
                      : currentTimetableInfo?.classType
                      ? "Thông tin lớp"
                      : "Thông tin giảng viên"}
                  </h5>
                </Popup.Header>
                <Popup.Content style={{ paddingTop: 5 }}>
                  {currentTimeTable?.value ? (
                    <ul>
                      <li>
                        <b>Khoa: </b>
                        {currentTimetableInfo?.faculty}
                      </li>
                      {currentTimetableInfo?.classSize && (
                        <li>
                          <b>Sĩ Số: </b>
                          {currentTimetableInfo?.classSize}
                        </li>
                      )}
                      {currentTimetableInfo?.classType && (
                        <li>
                          <b>Hệ: </b>
                          {currentTimetableInfo?.classType}
                        </li>
                      )}
                      <li>
                        <b>
                          Số Học Phần
                          {exists(currentTimetableInfo?.classSize) ||
                            " Giảng Dạy"}
                          :{" "}
                        </b>
                        {assignmentsArr?.length}
                      </li>
                    </ul>
                  ) : (
                    "Chọn một lớp hoặc giảng viên để hiển thị thông tin"
                  )}
                </Popup.Content>
              </Popup>
            </h1>
            <Button
              disabled={Object.keys(lectureObj)?.includes(
                currentTimeTable?.value
              )}
              onClick={handlePopulatedTimeTable}
            >
              xếp thời khóa biểu
            </Button>
          </header>
          <div>
            <Paper style={{ zIndex: 10 }} elevation={3}>
              {!!currentTimeTable || (
                <Backdrop
                  open={true}
                  style={{ zIndex: 20, position: "relative", height: "100%" }}
                >
                  <h2>
                    Chọn một giảng viên hoặc lớp học để hiện thời khóa biểu
                  </h2>
                </Backdrop>
              )}
              <Scheduler data={data} firstDayOfWeek={1} locale="vi-VN">
                <ViewState
                  defaultCurrentDate={semesterInfo?.semesterStart}
                  currentDate={
                    currentDateViewState ?? semesterInfo?.semesterStart
                  }
                  onCurrentDateChange={setCurrentDateViewState}
                />
                <EditingState
                  onCommitChanges={onCommitChanges}
                  // addedAppointment={addedAppointment}
                  // onAddedAppointmentChange={onAddedAppointmentChange}
                />
                <EditRecurrenceMenu messages={recurrenceEditMenu} />
                <WeekView
                  startDayHour={7}
                  endDayHour={11.35}
                  cellDuration={55}
                />
                <Appointments appointmentComponent={appointmentComponent} />
                <Toolbar />
                <DateNavigator />
                <TodayButton messages={{ today: "Hôm nay" }} />
                <IntegratedEditing />
                <AppointmentTooltip
                  showOpenButton
                  showDeleteButton
                  showCloseButton
                  contentComponent={Content}
                />
                <AppointmentForm commandButtonComponent={CommandButton} />
                <DragDropProvider
                  scrollSpeed={55}
                  {...{ allowDrag, allowResize }}
                />
                <TaskLimiter />
              </Scheduler>
              <Scheduler data={data} firstDayOfWeek={1} locale="vi-VN">
                <ViewState
                  defaultCurrentDate={semesterInfo?.semesterStart}
                  currentDate={
                    currentDateViewState ?? semesterInfo?.semesterStart
                  }
                  onCurrentDateChange={setCurrentDateViewState}
                />
                <WeekView
                  startDayHour={13}
                  endDayHour={17.5}
                  cellDuration={55}
                  dayScaleLayoutComponent={() => (
                    <div
                      style={{
                        padding: 10,
                      }}
                    >
                      Giờ Nghỉ Trưa
                    </div>
                  )}
                />
                <EditingState onCommitChanges={onCommitChanges} />
                <EditRecurrenceMenu messages={recurrenceEditMenu} />
                <Appointments appointmentComponent={appointmentComponent} />
                <IntegratedEditing />
                <AppointmentTooltip
                  showOpenButton
                  showDeleteButton
                  showCloseButton
                  contentComponent={Content}
                />
                <AppointmentForm commandButtonComponent={CommandButton} />
                <DragDropProvider
                  scrollSpeed={55}
                  {...{ allowDrag, allowResize }}
                />
                <TaskLimiter />
              </Scheduler>
            </Paper>
          </div>
        </div>
      )}
    </>
  );
};

const TimeTableNav = (props) => {
  const context = useContext(SemContext);

  const { semesterInfo } = context;

  return (
    <>
      <div className="timetable-nav">
        <h3 style={{ marginRight: 10 }}>
          {exists(semesterInfo) && semesterInfo["userNamed"]}
        </h3>
        <LinkButton to="mng-classes" style={{ marginRight: 10 }}>
          Lớp
        </LinkButton>
        <LinkButton to="mng-assignments" style={{ marginRight: 10 }}>
          Phân công giảng dạy
        </LinkButton>
        <LinkButton to="scheduler">Thời khóa biểu</LinkButton>
      </div>
    </>
  );
};

const Home = (props) => {
  return (
    <>
      <Link to="scheduler">forward</Link>
    </>
  );
};

const TimeTable = (props) => {
  const { semId } = props;

  return (
    <>
      <SemProvider {...{ semId }}>
        <TimeTableNav />
        <div className="mng-container" style={{ height: "calc(100% - 47px)" }}>
          <Router style={{ height: "100%" }}>
            <Home path="/" />
            <TimeTableScheduler path="scheduler" />
            <ManageClass path="mng-classes" />
            <ManageAssignments path="mng-assignments" />
            <NotFound default />
          </Router>
        </div>
      </SemProvider>
    </>
  );
};

export default TimeTable;
