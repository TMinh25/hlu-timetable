import React, {useState, useEffect} from "react";

// import components
import {Button} from "../../Button";
import {Form} from "semantic-ui-react";

const FormFaculties = ({
	currentFacultyId,
	facultiesList,
	handleOnAdd,
	handleOnModify,
	setCurrentFacultyId,
}) => {
	const initialState = {
		"faculty-id": "",
		"faculty-name": "",
		"faculty-note": "",
	};

	const [values, setValues] = useState(initialState);

	useEffect(() => {
		if (currentFacultyId == "") {
			setValues({...initialState});
		} else {
			setValues({...facultiesList[currentFacultyId]});
		}
	}, [currentFacultyId, facultiesList]);

	const handleInputChange = (e) => {
		var {name, value} = e.target;
		setValues({...values, [name]: value});
	};

	const handleButtonAdd = async (e) => {
		e.preventDefault();
		const response = await handleOnAdd(values);
		response && setValues(initialState);
	};

	const handleButtonModify = async (e) => {
		e.preventDefault();
		const response = await handleOnModify(values);
		response && setValues(initialState);
	};

	return (
		<>
			<Form id="manage__form">
				<Form.Input
					label="Tên khoa"
					title="Tên khoa"
					className="left-align"
					placeholder="Tên khoa"
					type="text"
					name="faculty-name"
					value={values["faculty-name"]}
					onChange={handleInputChange}
					required
					autoFocus
					autoComplete="off"
				/>
				<Form.TextArea
					label="Ghi chú"
					title="Ghi chú"
					name="faculty-note"
					placeholder="Ghi Chú"
					style={{marginBottom: 10}}
					cols="20"
					rows="10"
					value={values["faculty-note"]}
					onChange={handleInputChange}
				/>
				<div style={{display: "flex", justifyContent: "space-between"}}>
					<div>
						{currentFacultyId ? (
							<Button
								style={{margin: "0"}}
								type="submit"
								className="new"
								title="Chỉnh sửa khoa"
								onClick={handleButtonModify}
							>
								Chỉnh Sửa
							</Button>
						) : (
							<Button
								style={{margin: "0"}}
								type="submit"
								className="new"
								title="Thêm khoa mới vào hệ thống"
								onClick={handleButtonAdd}
							>
								Thêm
							</Button>
						)}
					</div>
					<div>
						{currentFacultyId && (
							<Button
								style={{margin: "0"}}
								className="sign-out"
								title="Hủy chỉnh sửa"
								onClick={() => {
									setCurrentFacultyId("");
									setValues(initialState);
								}}
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

export default FormFaculties;
