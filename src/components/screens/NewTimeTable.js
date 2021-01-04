import React, {useState, useEffect, useContext} from "react";

// import components
import {writeNote, database, userRef} from "../../firebase";
import {UserContext} from "../../providers/UserProvider";

const NewTimeTable = () => {
	const currentUser = useContext(UserContext);

	const [values, setValues] = useState({
		id: "",
		note: "",
	});
	const [noteObjects, setNoteObjects] = useState({});

	useEffect(() => {
		if (!!currentUser) {
			userRef(currentUser.uid)
				.child("note")
				.on("value", (snapshot) => {
					if (snapshot.val() != null) {
						setNoteObjects({...snapshot.val()});
					} else {
						setNoteObjects({});
					}
				});
		}
	}, [currentUser]); // similar to componentDidMount()

	const handleInputChange = (e) => {
		var {name, value} = e.target;
		setValues({
			...values,
			[name]: value,
		});
	};

	const handleOnSubmit = (e) => {
		e.preventDefault();
		writeNote(currentUser.uid, values);
	};

	// useEffect(() => {
	// 	if (!!currentUser) {
	// 		console.log(currentUser.uid);
	// 	}
	// }, [currentUser]);

	return (
		<>
			{!!currentUser ? (
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
						<button type="submit">save</button>
					</form>

					<div>
						{!!noteObjects ? (
							<ol>
								{Object.keys(noteObjects).map((id) => {
									return (
										<>
											<li key={id}>
												{noteObjects[id].id}, {noteObjects[id].note}
												<span
													onClick={() => {
														userRef(currentUser.uid)
															.child(`note/${id}`)
															.remove((err) => {
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
			) : (
				<div>Đăng nhập để tiếp tục</div>
			)}
		</>
	);
};

export default NewTimeTable;
