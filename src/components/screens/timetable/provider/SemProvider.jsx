import React, { useState, useEffect, createContext, useMemo } from "react";
import PropTypes from "prop-types";
import {
  auth,
  userRef,
  getAllLectures,
  getAllClasses,
} from "../../../../firebase";

// create context for using context between screen
export const SemContext = createContext({
  semValues: null,
});

export const SemProvider = (props) => {
  const [values, setValues] = useState({});
  const { semId, children } = props;

  const [lecturesObj, setLecturesObj] = useState({});
  const [classesObj, setClassesObj] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const updateGroupedOptions = () => {
    const lecturesOpt = [];
    const classesOpt = [];
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
    for (const key in classesObj) {
      if (Object.hasOwnProperty.call(classesObj, key)) {
        const currClass = classesObj[key];
        // add new data to options
        classesOpt.push({
          label: currClass["className"],
          value: key,
        });
      }
    }

    return [
      {
        label: "Giảng Viên",
        options: lecturesOpt,
      },
      {
        label: "Lớp Học",
        options: classesOpt,
      },
    ];
  };

  const groupedOptions = useMemo(() => {
    // console.log(lecturesObj);
    if (Object.keys(lecturesObj).length) {
      return updateGroupedOptions();
    }

    // eslint-disable-next-line
  }, [lecturesObj, classesObj]);

  useEffect(() => {
    async function fetchData() {
      const [allLectures, allClasses] = await Promise.all([
        getAllLectures(),
        getAllClasses(props.semId),
      ]);

      setLecturesObj(allLectures);
      setClassesObj(allClasses);
    }

    if (isLoading) {
      fetchData().then(() => setIsLoading(false));
    }

    // eslint-disable-next-line
  }, [isLoading]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      userRef(user.uid)
        .child(`semesters/${semId}`)
        .on("value", (snapshot) => {
          if (snapshot.val() != null) {
            setValues({ ...values, ...snapshot.val() });
          } else {
            setValues({});
          }
        });
    });
    // eslint-disable-next-line
  }, [semId]); // similar to componentDidMount()

  return (
    <SemContext.Provider
      value={{ ...values, ...props, groupedOptions, updateGroupedOptions }}
    >
      {children}
    </SemContext.Provider>
  );
};

SemProvider.propsType = {
  children: PropTypes.node,
  semId: PropTypes.string.isRequired,
};
