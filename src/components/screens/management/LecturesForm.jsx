import React, {useState, useEffect, useContext} from "react";

// import components
import {Button} from "../../Button";
import {setNewFaculty, auth} from "../../../firebase";

const LecturesForm = (props) => {
	const initialState = {
		"lecture-name": "",
		"lecture-email": "",
		"faculty": "",
	};

	const [values, setValues] = useState(initialState);

	// useEffect(() => {
	// 	if (props.currentFacultyId == "") {
	// 		setValues({...initialState});
	// 	} else {
	// 		setValues({...props.facultiesList[props.currentFacultyId]});
	// 	}
	// }, [props.currentFacultyId, props.facultiesList]);

	const handleInputChange = (e) => {
		var {name, value} = e.target;
		setValues({...values, [name]: value});
	};

	const handleSubmitForm = (e) => {
		e.preventDefault();

		// props.handleAddOrModify(values);
	};

	useEffect(() => {
		console.log(values);
	}, [values]);

	return (
		<>
			<form id="faculty__form">
				<label htmlFor="lecture-name">Họ tên:</label>
				<input
					title="Họ tên giảng viên"
					className="left-align"
					placeholder="Họ tên giảng viên"
					type="text"
					name="lecture-name"
					id="lecture-name"
					value={values["lecture-name"]}
					onChange={handleInputChange}
					required
					autoFocus
				/>
				<input
					title="Email"
					placeholder="Email"
					type="email"
					name="lecture-email"
					value={values["lecture-email"]}
					onChange={handleInputChange}
				/>
				{Object.keys(props.facultiesList).length ? (
					<>
						<select
							name="faculty"
							id="lecture__select-faculty"
							style={{marginBottom: 10}}
							onChange={handleInputChange}
						>
							<option selected disabled>
								--- Khoa ---
							</option>
							{Object.keys(props.facultiesList).map((id) => {
								return (
									<option value={props.facultiesList[id]["faculty-name"]}>
										{props.facultiesList[id]["faculty-name"]}
									</option>
								);
							})}
						</select>
					</>
				) : (
					<>
						<div className="alert__nothing">Bạn chưa có khoa nào để chọn</div>
					</>
				)}
				<div style={{display: "flex", justifyContent: "space-between"}}>
					<div>
						{props.currentFacultyId ? (
							<Button
								style={{margin: "0"}}
								type="submit"
								className="new"
								title="Chỉnh sửa khoa"
								onClick={async (e) => {
									e.preventDefault();
									const response = await props.handleOnModify(values);
									response && setValues(initialState);
								}}
							>
								Chỉnh Sửa
							</Button>
						) : (
							<Button
								style={{margin: "0"}}
								type="submit"
								className="new"
								title="Thêm khoa mới vào hệ thống"
								onClick={async (e) => {
									e.preventDefault();
									const response = await props.handleOnAdd(values);
									response && setValues(initialState);
								}}
							>
								Thêm
							</Button>
						)}
					</div>
					<div>
						{props.currentFacultyId && (
							<Button
								style={{margin: "0"}}
								className="sign-out"
								title="Hủy chỉnh sửa"
								onClick={() => {
									props.setCurrentFacultyId("");
									setValues(initialState);
								}}
							>
								Hủy
							</Button>
						)}
					</div>
				</div>
			</form>
		</>
	);
};

export default LecturesForm;
