import React, {useState, useEffect} from "react";

// import components
import {writeNote, database} from "../../firebase";

const NewTimeTable = () => {
	const [values, setValues] = useState({
		id: "",
		note: "",
	});

	const [noteObjects, setNoteObjects] = useState({});
	const [currentID, setCurrentID] = useState();

	useEffect(() => {
		database.child("note").on("value", (snapshot) => {
			if (snapshot.val() != null) {
				setNoteObjects({...snapshot.val()});
			}
		});
	}, []); // similar to componentDidMount()

	const handleInputChange = (e) => {
		var {name, value} = e.target;
		setValues({
			...values,
			[name]: value,
		});
	};

	const handleOnSubmit = (e) => {
		e.preventDefault();
		writeNote(values);
	};

	useEffect(() => {
		console.log(noteObjects);
	}, [noteObjects]);

	return (
		<>
			<h1>Hãy bắt đầu tạo thời khóa biểu mới!</h1>
			<div>Đầu tiên hãy chọn thời gian của kì học của bạn</div>
			<form onSubmit={handleOnSubmit}>
				<input
					name="id"
					value={values.id}
					placeholder="id"
					onChange={handleInputChange}
				/>
				<input
					name="note"
					value={values.note}
					placeholder="note"
					onChange={handleInputChange}
				/>
				<button>save</button>
			</form>

			<div>
				{!!Object.keys(noteObjects).length ? (
					<ol>
						{Object.keys(noteObjects).map((id) => {
							return (
								<>
									<li key={id}>
										{noteObjects[id].id}, {noteObjects[id].note}
										<span
											onClick={() => {
												database.child("note/" + id).remove((err) => {
													if (err) {
														console.warn("failed to remove: " + err);
													}
												});
											}}
											style={{
												color: "red",
												backgroundColor: "white",
												cursor: "pointer",
											}}
										>
											x
										</span>
									</li>
								</>
							);
						})}
					</ol>
				) : (
					<div>
						<h1>No note yet!</h1>
					</div>
				)}
			</div>
		</>
	);
};

export default NewTimeTable;
