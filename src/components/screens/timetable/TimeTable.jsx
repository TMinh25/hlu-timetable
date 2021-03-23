import React, { useEffect, useState, useContext } from "react";
// import components
import NotFound from "../NotFound";
import { Router, Link } from "@reach/router";
import Select from "react-select";
import { SemProvider, SemContext } from "./provider/SemProvider";

// import styles
import "./styles.css";
import { exists } from "../../../utils";
import { LinkButton } from "../../Components";
import ManageClass from "../management/ManageClass";

const Home = (props) => {
  return (
    <>
      <Link to="class-timetable">asd</Link>
    </>
  );
};

const ClassTimeTable = (props) => {
  const context = useContext(SemContext);

  const { semValues, currentTimeTable, semesterInfo } = context;

  useEffect(() => {
    console.log(context);

    console.log(semesterInfo);
  }, [context, semesterInfo]);

  return (
    <>
      {exists(context) && (
        <div>
          <Link to="../">asasdd</Link>
          <h1>{exists(currentTimeTable) && currentTimeTable.label} asd</h1>
          <h1>
            id:
            {Object.keys(semesterInfo).length && semesterInfo["user-named"]}
          </h1>
          <p>note: {props.timeTableId}</p>
        </div>
      )}
    </>
  );
};

const TimeTableNav = (props) => {
  const context = useContext(SemContext);

  const { groupedOptions, semValues, semesterInfo } = context;

  const { setCurrentTimeTable } = props;

  return (
    <>
      <h3>{exists(semesterInfo) && semesterInfo["user-named"]}</h3>
      <div className="timetable-nav">
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
              option: (provided, state) => ({
                ...provided,
                color: state.isSelected ? "darkgray" : "black",
              }),
              control: (provided, state) => ({
                ...provided,
                width: 500,
                maxHeight: 400,
                overFlow: "hidden",
              }),
            }}
          />
        )}
        <LinkButton to="class-timetable">asd</LinkButton>
        <LinkButton to="mng-classes">asd</LinkButton>
      </div>
    </>
  );
};

const TimeTable = (props) => {
  const { timeTableId } = props;

  const [currentTimeTable, setCurrentTimeTable] = useState(null);

  useEffect(() => {
    console.log(currentTimeTable);
  }, [currentTimeTable]);

  return (
    <>
      <SemProvider {...{ timeTableId, currentTimeTable, setCurrentTimeTable }}>
        <TimeTableNav
          {...{
            currentTimeTable,
            setCurrentTimeTable,
          }}
          path="/"
        />
        {/* <Router primary={false}></Router> */}
        <Router>
          <Home path="/" />
          <ClassTimeTable path="class-timetable" />
          <ManageClass path="mng-classes" />
          <NotFound default />
        </Router>
      </SemProvider>
    </>
  );
};

export default TimeTable;
