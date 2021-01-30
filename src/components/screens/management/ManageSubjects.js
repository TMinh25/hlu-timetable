import React, {useEffect, useState} from "react";
import {
	getAllSubjects,
	modifySubject,
	newSubject,
	removeSubject,
} from "../../../firebase";

// import components
import FormSubjects from "./FormSubjects";
import Loading from "../../Loading";
import {confirmAlert} from "react-confirm-alert";
import {Icon, Input} from "semantic-ui-react";

//import styles
import "./Manage.css";

const SubjectListItem = ({
	id,
	index,
	onClick,
	onRemove,
	subjectName,
	credit,
	periods,
}) => {
	return (
		<li onClick={onClick} className="list__container-li_item" key={index}>
			<p className="li__item-search">{subjectName}</p>
			<p>{credit}</p>
			<p>{periods}</p>
			<span className="btn__trash" onClick={onRemove}>
				<i className="fas fa-trash-alt" />
			</span>
		</li>
	);
};

const ManageSubjects = () => {
	//#region State

	const [subjectsObj, setSubjectsObj] = useState({});
	const [currentSubjectId, setCurrentSubjectId] = useState("");
	const [searchString, setSearchString] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	//#endregion

	//#region Hooks

	useEffect(() => {
		getAllSubjects((result) => {
			setSubjectsObj(result);
			setIsLoading((prev) => false);
		});
	}, [isLoading]);

	useEffect(() => {
		const li = document.getElementsByClassName("list__container-li_item");
		for (let i = 0; i < Object.keys(subjectsObj).length; i++) {
			const item = li[i].getElementsByClassName("li__item-search")[0];
			// let txtValue = item.textContent || item.innerHTML;
			let txtValue = item.textContent || item.innerHTML;
			if (txtValue.toLowerCase().includes(searchString.toLowerCase())) {
				li[i].style.display = "";
			} else {
				li[i].style.display = "none";
			}
		}
	}, [searchString]); // search for text in list when searchString change

	//#endregion

	//#region Methods

	const handleOnAdd = (values) => {
		if (values["subject-name"] && values["credit"] && values["periods"]) {
			newSubject(values);
			setIsLoading(true);
		}
	};

	const handleOnModify = (id, values) => {
		if (!!Object.keys(values).length) {
			modifySubject(id, values);
			setCurrentSubjectId("");
			setIsLoading(true);
		}
	};

	const handleOnRemove = (id) => {
		confirmAlert({
			title: "Bạn có chắc muốn xóa khoa này?",
			message: "Bạn sẽ không thể truy cập lại thông tin này",
			buttons: [
				{
					className: "confirm__cancel",
					label: "Hủy",
				},
				{
					className: "sign-out",
					label: "Xóa",
					onClick: () => {
						removeSubject(id);
						setCurrentSubjectId("");
						setIsLoading(true);
					},
				},
			],
		});
	};

	//#endregion

	return (
		<>
			<div className="mng-container">
				<div className="form-list__container">
					<div className="form__container">
						<FormSubjects
							{...{
								subjectsObj,
								currentSubjectId,
								setCurrentSubjectId,
								handleOnAdd,
								handleOnModify,
							}}
						/>
					</div>
					<div className="list__container">
						<div className="list__container-search subject-list">
							<input
								type="text"
								className="text__search"
								onChange={({target}) => setSearchString(target.value)}
								name="search-string"
								value={searchString}
								placeholder="Tìm kiếm..."
							/>
							<div className="list__header">
								<h5>Tên học phần</h5>
								<h5>Số tín chỉ</h5>
								<h5>Số tiết</h5>
							</div>
						</div>
						{!!Object.keys(subjectsObj).length ? (
							<ul>
								{Object.keys(subjectsObj)
									.reverse()
									.map((id, index) => {
										return (
											<SubjectListItem
												id={id}
												index={index}
												onClick={() => setCurrentSubjectId(id)}
												onRemove={() => handleOnRemove(id)}
												subjectName={subjectsObj[id]["subject-name"]}
												credit={subjectsObj[id]["credit"]}
												periods={subjectsObj[id]["periods"]}
											/>
										);
									})}
							</ul>
						) : (
							<p>no subject</p>
						)}
					</div>
				</div>
			</div>
			{isLoading && <Loading />}
		</>
	);
};

export default ManageSubjects;
