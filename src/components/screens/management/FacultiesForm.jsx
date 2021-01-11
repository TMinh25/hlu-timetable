import React, {useState, useEffect, useContext} from "react";

// import components
import {Button} from "../../Button";
import {setNewFaculty, auth} from "../../../firebase";

const FacultiesForm = () => {
	const initialState = {
		"faculty-id": "",
		"faculty-name": "",
		"faculty-note": "",
	};

	const [values, setValues] = useState(initialState);

	const getFacultyId = () => {
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
		if (auth.currentUser && values) {
			setNewFaculty(values);
			setValues(initialState);
		} else {

    }
	}, [values["faculty-id"]]);

	// useEffect(() => {
	// 	console.warn(values);
	// }, [values]);

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
					cols="20"
					rows="10"
					value={values["faculty-note"]}
					onChange={handleInputChange}
				/>
				<Button
					type="submit"
					className="new"
					title="Thêm khoa mới vào hệ thống"
					onClick={handleSubmitForm}
				>
					Thêm
				</Button>
			</form>
		</>
	);
};

export default FacultiesForm;
