import React, {useState, useEffect, useContext} from "react";

// import components
import {Button} from "../../Button";
import {setNewFaculty, auth} from "../../../firebase";

const FacultiesForm = ({facultiesList, currentFacultyId}) => {
	const initialState = {
		"faculty-id": "",
		"faculty-name": "",
		"faculty-note": "",
	};

	const [values, setValues] = useState(initialState);

	useEffect(() => {
		if (currentFacultyId == "") {
			setValues(...initialState);
		} else {
			setValues({...facultiesList[currentFacultyId]});
		}
	}, [currentFacultyId, facultiesList]);

	const getFacultyId = async () => {
		if (values["faculty-name"]) {
			let id = "";

			// Tách từ tên khoa ra làm mã khoa
			id = values["faculty-name"]
				.trim()
				.split(" ")
				.map((word) => {
					return word[0].toUpperCase();
				})
				.join("");

			setValues({
				...values,
				"faculty-id": id,
			});
		}
	};

	const handleInputChange = (e) => {
		var {name, value} = e.target;
		setValues({...values, [name]: value});
	};

	const handleSubmitForm = (e) => {
		e.preventDefault();
		getFacultyId();
	};

	useEffect(() => {
		if (values["faculty-id"]) {
			setNewFaculty(values["faculty-id"], values);
			setValues(initialState);
		}
	}, [values["faculty-id"]]);

	useEffect(() => {
		console.log(values);
	}, [values]);

	return (
		<>
			<form onSubmit={handleSubmitForm} id="faculty__form">
				<input
					title="Tên khoa"
					className="left-align"
					placeholder="Tên khoa"
					type="text"
					name="faculty-name"
					value={values["faculty-name"]}
					onChange={handleInputChange}
					required
				/>
				<textarea
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
					<Button
						style={{margin: "0"}}
						type="submit"
						className="new"
						title="Thêm khoa mới vào hệ thống"
						onClick={handleSubmitForm}
					>
						{currentFacultyId ? "Chỉnh Sửa" : "Thêm"}
					</Button>
					{currentFacultyId && (
						<Button
							style={{margin: "0"}}
							className="sign-out"
							title="Hủy chỉnh sửa"
							onClick={() => setValues(initialState)}
						>
							Hủy
						</Button>
					)}
				</div>
			</form>
		</>
	);
};

export default FacultiesForm;
