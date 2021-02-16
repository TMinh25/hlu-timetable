import React, { useState, useEffect } from "react";
import { defaultFailCB, selectAllOnFocus } from "../../../utils";

// import components
import { Button } from "../../Components";
import { Form } from "semantic-ui-react";

// import styles

const FormSubjects = ({
	currentSubjectId,
	subjectsObj,
	setCurrentSubjectId,
	handleOnAdd,
	handleOnModify,
}) => {
	const initialState = {
		"subject-name": "",
		credit: "",
		periods: "",
	};

	const [values, setValues] = useState(initialState);

	useEffect(() => {
		if (currentSubjectId === "") {
			setValues({ ...initialState });
		} else {
			setValues({ ...subjectsObj[currentSubjectId] });
		}
		// eslint-disable-next-line
	}, [currentSubjectId, subjectsObj]);

	// useEffect(() => {
	// 	if (currentLectureId) {
	// 		document.getElementById("lecture__select-faculty").value =
	// 			lecturesObj[currentLectureId]["faculty"];
	// 	}
	// }, [currentLectureId, lecturesObj, facultiesObj]);

	useEffect(() => {
		console.log(values);
	}, [values]);

	const handleInputChange = (e) => {
		var { name, value, type } = e.target;
		const typeCheckedValues = {
			...values,
			[name]: type === "number" ? parseInt(value, 10) : value,
		};
		setValues(typeCheckedValues);
	};

	const handleButtonAdd = (e) => {
		e.preventDefault();
		try {
			handleOnAdd({ values });
		} catch (err) {
			defaultFailCB(err);
		}
		setValues(initialState);
	};

	const handleButtonModify = (e) => {
		e.preventDefault();
		handleOnModify(currentSubjectId, values);
		setValues(initialState);
	};

	const cancelModify = () => {
		setCurrentSubjectId("");
		setValues(initialState);
	};

	return (
		<>
			<Form id="manage__form">
				<Form.Input
					label="Tên môn học"
					title="Tên môn học"
					placeholder="Tên môn học"
					id="subject-name"
					name="subject-name"
					value={values["subject-name"]}
					onChange={handleInputChange}
					onFocus={selectAllOnFocus}
					required
				/>
				<Form.Input
					label="Số tín chỉ"
					title="Số tín chỉ"
					placeholder="Số tín chỉ"
					type="number"
					id="credit"
					name="credit"
					value={values["credit"]}
					onChange={handleInputChange}
					onFocus={selectAllOnFocus}
					required
				/>
				<Form.Input
					label="Số tiết"
					title="Số tiết"
					placeholder="Số tiết"
					type="number"
					id="periods"
					name="periods"
					value={values["periods"]}
					onChange={handleInputChange}
					onFocus={selectAllOnFocus}
					required
				/>
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<div>
						{currentSubjectId ? (
							<Button
								style={{ margin: 0, height: "100%" }}
								type="submit"
								className="new"
								title="Chỉnh sửa khoa"
								onClick={handleButtonModify}
							>
								Chỉnh Sửa
							</Button>
						) : (
							<Button
								style={{ margin: 0, height: "100%" }}
								type="submit"
								className="new"
								title="Thêm giảng viên mới"
								onClick={handleButtonAdd}
							>
								Thêm
							</Button>
						)}
					</div>
					<div>
						{currentSubjectId && (
							<Button
								style={{ margin: "0", height: "100%" }}
								className="sign-out"
								title="Hủy chỉnh sửa"
								onClick={cancelModify}
							>
								Hủy
							</Button>
						)}
					</div>
				</div>
			</Form>
		</>
	);
};

export default FormSubjects;
