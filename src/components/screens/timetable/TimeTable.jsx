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
      <Link to="class-timetable">forward</Link>
    </>
  );
};

const ClassTimeTable = (props) => {
  const context = useContext(SemContext);

  const { currentTimeTable, semesterInfo } = context;

  useEffect(() => {
    console.log(context);

    console.log(semesterInfo);
  }, [context, semesterInfo]);

  return (
    <>
      {exists(context) && (
        <div>
          <Link to="../">back</Link>
          <h1>{exists(currentTimeTable) && currentTimeTable.label} asd</h1>
          {/* <h1>
            id:
            {Object.keys(semesterInfo).length && semesterInfo["user-named"]}
          </h1> */}
          <p>note: {props.semId}</p>
        </div>
      )}
    </>
  );
};

const TimeTableNav = (props) => {
  const context = useContext(SemContext);

  const { groupedOptions, semesterInfo } = context;

  const { setCurrentTimeTable } = props;

  return (
    <>
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
                marginRight: 10,
                overFlow: "hidden",
              }),
            }}
          />
        )}
        <LinkButton to="mng-classes" style={{ marginRight: 10 }}>
          Lớp
        </LinkButton>
        <LinkButton to="mng-assignments">Phân công giảng dạy</LinkButton>
      </div>
      <h3 style={{ marginBottom: 10 }}>
        {exists(semesterInfo) && semesterInfo["user-named"]}
      </h3>
    </>
  );
};

const TimeTable = (props) => {
  const { semId } = props;

  const [currentTimeTable, setCurrentTimeTable] = useState(null);

  useEffect(() => {
    console.log(currentTimeTable);
  }, [currentTimeTable]);

  return (
    <>
      <SemProvider {...{ semId, currentTimeTable, setCurrentTimeTable }}>
        <TimeTableNav
          {...{
            currentTimeTable,
            setCurrentTimeTable,
          }}
          path="/"
        />
        <Router>
          <Home path="/" />
          <ClassTimeTable path="class-timetable" />
          <ManageClass path="mng-classes" />
          <ManageClass path="mng-assignments" />
          <NotFound default />
        </Router>
      </SemProvider>
    </>
  );
};

export default TimeTable;
