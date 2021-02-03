import React, {useEffect, useState} from "react";

// import components
import FormLectures from "./FormLectures";
import {
	newLecture,
	modifyLecture,
	removeLecture,
	getAllLectures,
	getAllFaculties,
} from "../../../firebase";
import {confirmAlert} from "react-confirm-alert";
import Loading from "../../Loading";

// import styles
import "./Manage.css";

const LectureListItem = ({index, name, faculty, onRemove, onClick}) => {
	return (
		<>
			<li key={index} className="list__container-li_item" onClick={onClick}>
				<p className="li__item-search">{index + 1}</p>
				<p className="li__item-search">{name}</p>
				<p className="li__item-search">
					{faculty !== "defaultValue" ? faculty : "Không"}
				</p>
				<span className="btn__trash trash" onClick={() => onRemove(index)}>
					<i className="fas fa-trash-alt" />
				</span>
			</li>
		</>
	);
};

const ManageLectures = () => {
	//#region Component State

	const [lecturesObj, setLecturesObj] = useState({});
	const [facultiesObj, setFacultiesObj] = useState({});
	const [currentLectureId, setCurrentLectureId] = useState();
	const [searchString, setSearchString] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	//#endregion

	//#region Hooks

	useEffect(() => {
		getAllLectures((result) => {
			setLecturesObj(result);
		});
		getAllFaculties((result) => {
			setFacultiesObj(result);
			setIsLoading(false);
		});
	}, [isLoading]); // similar to fetching lectures list on componentUpdate()

	useEffect(() => {
		const li = document.getElementsByClassName("list__container-li_item");
		for (let i = 0; i < li.length; i++) {
			const items = li[i].querySelectorAll(".li__item-search");
			let isInclude = [];
			items.forEach((item) => {
				let txtValue = item.textContent || item.innerHTML;
				isInclude.push(
					txtValue.toLowerCase().includes(searchString.toLowerCase())
						? true
						: false
				);
			});
			if (isInclude.some((item) => item === true)) {
				li[i].style.display = "";
			} else {
				li[i].style.display = "none";
			}
		}
	}, [searchString]); // search for text in list when searchString change

	//#endregion

	//#region Component Method

	const handleOnAdd = (values) => {
		return new Promise((resolve) => {
			if (!!values["lecture-name"]) {
				newLecture(values);
				setIsLoading(true);
			}
			resolve(true);
		});
	};

	const handleOnModify = (id, values) => {
		return new Promise((resolve) => {
			if (!!Object.keys(values).length) {
				modifyLecture(id, values);
				setCurrentLectureId("");
				setIsLoading(true);
			}
			resolve(true);
		});
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
						removeLecture(id);
						setCurrentLectureId("");
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
						<FormLectures
							{...{
								facultiesObj,
								lecturesObj,
								currentLectureId,
								setCurrentLectureId,
								handleOnAdd,
								handleOnModify,
							}}
						/>
					</div>

					<div className="list__container lecture-list">
						<div className="list__container-search">
							<input
								type="text"
								className="text__search"
								onChange={({target}) => setSearchString(target.value)}
								name="search-string"
								value={searchString}
								placeholder="Tìm kiếm..."
							/>
							<div className="list__header">
								<h5>STT</h5>
								<h5>Tên giảng viên</h5>
								<h5>Khoa</h5>
							</div>
						</div>
						{!!Object.keys(lecturesObj).length ? (
							<ul>
								{Object.keys(lecturesObj)
									.reverse()
									.map((id, index) => {
										return (
											<LectureListItem
												index={index}
												name={lecturesObj[id]["lecture-name"]}
												faculty={lecturesObj[id]["faculty"]}
												onRemove={() => handleOnRemove(id)}
												onClick={() => setCurrentLectureId(id)}
											/>
										);
									})}
							</ul>
						) : (
							<p>no lecture</p>
						)}
					</div>
				</div>
			</div>
			{isLoading && <Loading />}
		</>
	);
};

export default ManageLectures;
