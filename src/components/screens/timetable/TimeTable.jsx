import React, { useEffect, useState, createContext, useContext } from "react";

// import components
import {
	auth,
	userRef,
	getAllLectures,
	getAllSubjects,
} from "../../../firebase";
import NotFound from "../NotFound";
import { Router, Link } from "@reach/router";
import { Tabs } from "../../Components";
import Select from "react-select";
import PropTypes from "prop-types";

// import styles
import "./styles.css";
import "react-tabs/style/react-tabs.css";
import { render } from "@testing-library/react";
import { exists } from "../../../utils";

const Home = (props) => {
	return (
		<>
			<Link to="class-timetable">asd</Link>
		</>
	);
};

const ClassTimeTable = (props) => {
	const context = useContext(SemContext);

	const { groupedOptions, semester } = context;

	useEffect(() => {
		console.log(semester);
	}, [semester]);

	return (
		<div>
			<Link to="../">asasdd</Link>
			<h1>
				id:{" "}
				{Object.keys(semester).length &&
					semester["semester-info"]["user-named"]}
			</h1>
			<p>note: {props.timeTableId}</p>
		</div>
	);
};

// create context for using context between screen
export const SemContext = createContext({
	semester: null,
});

const SemProvider = (props) => {
	const [values, setValues] = useState({});
	const { timeTableId, children } = props;

	const [lecturesObj, setLecturesObj] = useState({});
	const [subjectsObj, setSubjectsObj] = useState({});
	const [groupedOptions, setGroupedOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// useEffect(() => {
	// 	console.log(semester);
	// }, [semester]);

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
	}, [groupedOptions]);

	useEffect(() => {
		console.log(values);
	}, [values]);

	useEffect(() => {
		if (!!auth.currentUser) {
			userRef(auth.currentUser.uid)
				.child(`semesters/${timeTableId}`)
				.on("value", (snapshot) => {
					if (snapshot.val() != null) {
						setValues({ ...values, semester: { ...snapshot.val() } });
					} else {
						setValues({});
					}
				});
		}
	}, [auth.currentUser, timeTableId]); // similar to componentDidMount()

	return <SemContext.Provider value={values}>{children}</SemContext.Provider>;
};

SemProvider.propsType = {
	children: PropTypes.node,
	timeTableId: PropTypes.string.isRequired,
};

const ClassNav = (props) => {
	const context = useContext(SemContext);

	const { groupedOptions, semester } = context;

	const { currentTimeTable, setCurrentTimeTable } = props;
	return (
		<>
			<div className="timetable-nav">
				<h3>{exists(semester) && semester["semester-info"]["user-named"]}</h3>
				{exists(groupedOptions) && (
					<Select
						className="basic-single"
						classNamePrefix="select"
						isClearable={true}
						isSearchable={true}
						name="timetable-id"
						onChange={setCurrentTimeTable}
						defaultValue={currentTimeTable || groupedOptions[0]}
						options={groupedOptions}
						placeholder="Thời Khóa Biểu"
					/>
				)}
			</div>
		</>
	);
};

const HomeNav = (props) => {
	const context = useContext(SemContext);

	const { groupedOptions, semester } = context;

	const { currentTimeTable, setCurrentTimeTable } = props;

	return (
		<>
			<div className="timetable-nav">
				<h3>{exists(semester) && semester["semester-info"]["user-named"]}</h3>
				{exists(groupedOptions) && (
					<Select
						className="basic-single"
						classNamePrefix="select"
						isClearable={true}
						isSearchable={true}
						name="timetable-id"
						onChange={setCurrentTimeTable}
						defaultValue={currentTimeTable || groupedOptions[0]}
						options={groupedOptions}
						placeholder="Thời Khóa Biểu"
					/>
				)}
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
			<SemProvider {...{ timeTableId }}>
				<Router primary={false}>
					<HomeNav
						{...{
							currentTimeTable,
							setCurrentTimeTable,
						}}
						path="/"
					/>
					<ClassNav
						{...{
							currentTimeTable,
							setCurrentTimeTable,
						}}
						path="class-timetable"
					/>
				</Router>
				<Router>
					<Home path="/" />
					<ClassTimeTable path="class-timetable" />
					<NotFound default />
				</Router>
			</SemProvider>
		</>
	);
};

export default TimeTable;
