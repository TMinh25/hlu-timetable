import React, {useState} from "react";
import {readExcel} from "../../../utils";

const FacultyListItem = ({index, facultyName, onAdd}) => (
	<li key={index} className="list__container-li_item">
		<p className="li__item-search">{facultyName}</p>
		<span className="btn__trash add" onClick={onAdd}>
			<i className="far fa-plus-square" />
		</span>
	</li>
);

const ExcelLoaderFaculties = ({handleOnAdd}) => {
	const [excelData, setExcelData] = useState();

	//
	const handleExcelLoad = async (file) => {
		const data = await readExcel(file, ["faculty-name", "faculty-note"]);
		setExcelData(
			data
				.slice(1)
				.map((item, index) => (
					<FacultyListItem
						index={index}
						facultyName={item["faculty-name"]}
						onAdd={() => handleOnAdd(item)}
					/>
				))
		);
		// console.error(data);
	};

	return (
		<>
			<input
				type="file"
				id="file"
				onChange={({target}) => {
					const file = target.files[0];
					handleExcelLoad(file);
				}}
			/>
			<div className="faculties-list">
				<ul>{excelData || "?"}</ul>
			</div>
		</>
	);
};

export default ExcelLoaderFaculties;
