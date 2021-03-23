import React, { useState, useEffect, createContext } from "react";
import PropTypes from "prop-types";
import {
  auth,
  userRef,
  getAllLectures,
  getAllSubjects,
} from "../../../../firebase";

// create context for using context between screen
export const SemContext = createContext({
  semValues: null,
});

export const SemProvider = (props) => {
  const [values, setValues] = useState({});
  const { timeTableId, children } = props;

  const [lecturesObj, setLecturesObj] = useState({});
  const [subjectsObj, setSubjectsObj] = useState({});
  const [groupedOptions, setGroupedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      getAllLectures((res) => setLecturesObj(res));
      getAllSubjects((res) => {
        setSubjectsObj(res);
        setIsLoading(false);
      });
    }
  }, [isLoading]);

  useEffect(() => {
    // console.log(lecturesObj);
    if (Object.keys(lecturesObj).length) {
      const lecturesOpt = [];
      const subjectsOpt = [];
      for (const key in lecturesObj) {
        if (Object.hasOwnProperty.call(lecturesObj, key)) {
          const element = lecturesObj[key];

          // add new data to options
          lecturesOpt.push({
            label: element["lecture-name"],
            value: key,
          });
        }
      }

      for (const key in subjectsObj) {
        if (Object.hasOwnProperty.call(subjectsObj, key)) {
          const element = subjectsObj[key];

          // add new data to options
          subjectsOpt.push({
            label: element["subject-name"],
            value: key,
          });
        }
      }
      setGroupedOptions([
        {
          label: "Giảng Viên",
          options: lecturesOpt,
        },
        {
          label: "Môn Học",
          options: subjectsOpt,
        },
      ]);
    }
  }, [lecturesObj, subjectsObj]);

  useEffect(() => {
    if (Object.keys(groupedOptions).length > 0) {
      setValues({ ...values, groupedOptions: groupedOptions });
    }
    // eslint-disable-next-line
  }, [groupedOptions]);

  useEffect(() => {
    if (!!auth.currentUser) {
      userRef(auth.currentUser.uid)
        .child(`semesters/${timeTableId}`)
        .on("value", (snapshot) => {
          if (snapshot.val() != null) {
            setValues({ ...values, ...snapshot.val() });
          } else {
            setValues({});
          }
        });
    }
    // eslint-disable-next-line
  }, [auth.currentUser, timeTableId]); // similar to componentDidMount()

  return (
    <SemContext.Provider value={{ ...values, ...props }}>
      {children}
    </SemContext.Provider>
  );
};

SemProvider.propsType = {
  children: PropTypes.node,
  timeTableId: PropTypes.string.isRequired,
};
