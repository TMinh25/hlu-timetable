import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
// import components
import NotFound from "../NotFound";
import { Router, Link } from "@reach/router";
import Select from "react-select";
import { SemProvider, SemContext } from "./provider/SemProvider";

// import styles
import "./styles.css";
import { withStyles } from "@material-ui/core/styles";
import {
  defaultSuccessCB,
  exists,
  getEndTime,
  getStartTime,
  isValidTimeSlot,
} from "../../../utils";
import { Button, LinkButton, Loading } from "../../Components";
import ManageClass from "../management/ManageClass";
import ManageAssignments from "../management/ManageAssigments";
import {
  classRef,
  getAllClasses,
  getAllLectures,
  getAllSubjects,
  getAssignmentsOfClass,
  getAssignmentsOfLecture,
  getClass,
  getClassSchedulerArray,
  getLecture,
  semRef,
  setSchedulerArray,
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
import { Backdrop } from "@material-ui/core";

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
    } else return {};

    //eslint-disable-next-line
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

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  const onCommitChanges = useCallback(
    ({ added, changed, deleted }) => {
      if (added) {
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        setData([...data, { id: startingAddedId, ...added }]);
      }
      if (changed) {
        setData(
          data.map((appointment) =>
            changed[appointment.id]
              ? { ...appointment, ...changed[appointment.id] }
              : appointment
          )
        );
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
                setData(
                  data.filter((appointment) => appointment.id !== deleted)
                );
                defaultSuccessCB();
              },
            },
          ],
        });
      }
    },
    [setData, data]
  );

  const onAddedAppointmentChange = useCallback((appointment) => {
    setAddedAppointment(appointment);
  }, []);

  const CommandButton = useCallback(({ id, ...restProps }) => {
    // if (id === "deleteButton") {
    //   return <AppointmentForm.CommandButton id={id} {...restProps} />;
    // }
    return (
      <AppointmentForm.CommandButton id={id} {...restProps} disable={false} />
    );
  }, []);

  useEffect(() => {
    console.log("data", data);

    // const a = moment(
    //   "Mon Apr 05 2021 7:35:00 GMT+0700 (Indochina Time)"
    // ).format("HH:mm");

    // console.log(
    //   isValidTimeSlot(
    //     getStartTime(moment("Mon Apr 05 2021").add(1, "day"), 2),
    //     getEndTime(moment("Mon Apr 05 2021").add(1, "day"), 5),
    //     moment("Mon Apr 05 2021 07:00:00 GMT+0700 (Indochina Time)"),
    //     moment("Mon Apr 05 2021 11:35:00 GMT+0700 (Indochina Time)")
    //   )
    // );
  }, [data]);

  function handlePopulatedTimeTable() {
    setIsLoading(true);
    if (currentTimeTable.value && assignmentsArr?.length) {
      getClassSchedulerArray(props.semId, currentTimeTable.value).then(
        (scheduleArray) => {
          console.log("scheduleArr", scheduleArray);
          const scheduleArrayInput = [];
          assignmentsArr.forEach((assignment, index) => {
            const { numberOfClassPerWeek, subjectName, weekCount } = assignment;
            var classTimeStart = 1,
              classTimeEnd = classTimeStart + numberOfClassPerWeek - 1;
            var startDate = new Date(
              getStartTime(semesterInfo?.semesterStart, classTimeStart)
            );
            var endDate = new Date(
              getEndTime(semesterInfo?.semesterStart, classTimeEnd)
            );

            while (
              // eslint-disable-next-line no-loop-func
              scheduleArrayInput.every((item) => {
                console.log(item);
                return isValidTimeSlot(
                  startDate,
                  endDate,
                  item?.startDate,
                  item?.endDate
                );
              }) === false
            ) {
              var date = moment(startDate);
              classTimeStart++;
              classTimeEnd = classTimeStart + numberOfClassPerWeek - 1;
              if (classTimeEnd > 10) {
                classTimeStart = 1;
                classTimeEnd = classTimeStart + numberOfClassPerWeek - 1;
                console.error("added date");
                date = moment(date.add(1, "day"));
              }

              // if (
              //   // eslint-disable-next-line no-loop-func
              //   // scheduleArrayInput.every((item) =>
              //   //   isValidDay(date, item?.startDate)
              //   // )
              // ) {
              // }
              console.log(date.toString());
              startDate = new Date(getStartTime(date, classTimeStart));
              endDate = new Date(getEndTime(date, classTimeEnd));
            }

            console.log(classTimeStart, classTimeEnd, startDate, endDate);

            scheduleArrayInput.push({
              title: subjectName,
              data: assignment,
              id: index,
              startDate,
              endDate,
              rRule: "FREQ=WEEKLY;COUNT=" + weekCount,
            });
          });

          console.log("scheduleArrayInput", scheduleArrayInput);
          setData(scheduleArrayInput);
          setSchedulerArray(
            props.semId,
            currentTimeTable.value,
            scheduleArrayInput
          );
        }
      );
    }
    setIsLoading(false);
  }

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
            <Button onClick={handlePopulatedTimeTable}>
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
                  addedAppointment={addedAppointment}
                  onAddedAppointmentChange={onAddedAppointmentChange}
                />
                <EditRecurrenceMenu />
                <WeekView
                  startDayHour={7}
                  endDayHour={11.35}
                  cellDuration={55}
                />
                <Toolbar />
                <DateNavigator />
                <TodayButton messages={{ today: "Hôm nay" }} />
                <IntegratedEditing />
                <Appointments />
                <AppointmentTooltip
                  showOpenButton
                  showDeleteButton
                  showCloseButton
                />
                <AppointmentForm commandButtonComponent={CommandButton} />
                <DragDropProvider />
                <TaskLimiter />
              </Scheduler>
              <Scheduler data={data} firstDayOfWeek={1} locale="vi-VN">
                <ViewState
                  defaultCurrentDate={semesterInfo?.semesterStart}
                  currentDate={
                    currentDateViewState ?? semesterInfo?.semesterStart
                  }
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
                  // timeTableCellComponent={TimeTableCell}
                />
                <EditingState
                  onCommitChanges={onCommitChanges}
                  addedAppointment={addedAppointment}
                  onAddedAppointmentChange={onAddedAppointmentChange}
                />
                <EditRecurrenceMenu />
                <IntegratedEditing />
                <Appointments />
                <AppointmentTooltip
                  showOpenButton
                  showDeleteButton
                  showCloseButton
                />
                <AppointmentForm commandButtonComponent={CommandButton} />
                <DragDropProvider scrollSpeed={55} />
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
