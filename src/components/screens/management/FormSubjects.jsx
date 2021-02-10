import React, {useState, useEffect} from "react";
import {modifySubject, newSubject} from "../../../firebase";

// import components
import {Button} from "../../Components";
import {Form} from "semantic-ui-react";

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
			setValues({...initialState});
		} else {
			setValues({...subjectsObj[currentSubjectId]});
		}
	}, [currentSubjectId, subjectsObj]);

	// useEffect(() => {
	// 	if (currentLectureId) {
	// 		document.getElementById("lecture__select-faculty").value =
	// 			lecturesObj[currentLectureId]["faculty"];
	// 	}
	// }, [currentLectureId, lecturesObj, facultiesObj]);

	const handleInputChange = (e) => {
		var {name, value} = e.target;
		setValues({...values, [name]: value});
	};

	const handleButtonAdd = (e) => {
		e.preventDefault();
		handleOnAdd(values);
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
					required
				/>
				<div style={{display: "flex", justifyContent: "space-between"}}>
					<div>
						{currentSubjectId ? (
							<Button
								style={{margin: 0, height: "100%"}}
								type="submit"
								className="new"
								title="Chỉnh sửa khoa"
								onClick={handleButtonModify}
							>
								Chỉnh Sửa
							</Button>
						) : (
							<Button
								style={{margin: 0, height: "100%"}}
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
								style={{margin: "0", height: "100%"}}
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
