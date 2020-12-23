import React from "react";

// import components
import NavBar from "../NavBar";
import LeftMenu from "../LeftMenu";
import Muuri from "muuri";

// import styles
import "./TeacherTimeTable.css";

const TeacherTimeTable = () => {
	const [leftMenuVisible, setLeftMenuVisible] = React.useState(true);

	const handleHamburgerClick = () => {
		setLeftMenuVisible((prev) => !prev);
	};

	React.useEffect(() => {
		var dragContainer = document.querySelector(".drag-container");
		var itemContainers = [].slice.call(
			document.querySelectorAll(".board-column-content")
		);
		var columnGrids = [];
		var boardGrid;

		// Init the column grids so we can drag those items around.
		itemContainers.forEach(function (container) {
			var grid = new Muuri(container, {
				items: ".board-item",
				dragEnabled: true,
				dragAxis: "xy",
				dragPlaceholder: {enabled: true},
				dragSort: function () {
					return columnGrids;
				},
				dragContainer: dragContainer,
				dragAutoScroll: {
					targets: (item) => {
						return [
							{element: window, priority: 0},
							{element: item.getGrid().getElement().parentNode, priority: 1},
						];
					},
				},
			})
				.on("dragInit", function (item) {
					item.getElement().style.width = item.getWidth() + "px";
					item.getElement().style.height = item.getHeight() + "px";
				})
				.on("dragReleaseEnd", function (item) {
					item.getElement().style.width = "";
					item.getElement().style.height = "";
					item.getGrid().refreshItems([item]);
				})
				.on("layoutStart", function () {
					boardGrid.refreshItems().layout();
				})
				.on("dragEnd", function (item, event) {
					console.log(item, event);
					for (const column of columns) {
						var lessonCount = 0;
						for (const child of column.children) {
							// console.log(parseInt(child.getAttribute("data-lessonCount")));
							lessonCount += parseInt(child.getAttribute("data-lessonCount"));
							// console.log(child);
						}
						console.log(lessonCount);
					}
				});

			columnGrids.push(grid);
		});

		// Init board grid so we can drag those columns around.
		boardGrid = new Muuri(".board", {
			dragEnabled: false,
		});
	}, []);

	var columns = document.getElementsByClassName("board-column-content");

	const BoardItem = ({subject, teacher, lessonCount}) => {
		return (
			<div
				className="board-item"
				style={{height: `${lessonCount * 30}px`}}
				data-lessonCount={lessonCount}
			>
				<div className="board-item-content">
					<span className="board-item-content-subject">{subject}</span>
					<br />
					<span className="board-item-content-teacher">{teacher}</span>
				</div>
			</div>
		);
	};

	return (
		<>
			<NavBar
				to="/"
				showHamburger={true}
				onHamburgerClick={handleHamburgerClick}
			/>
			<main className="content">
				<LeftMenu visible={leftMenuVisible} />
				<div className="main-content">
					<div className="drag-container"></div>
					<div className="board">
						<div className="board-column mon">
							<div className="board-column-container">
								<div className="board-column-header">Thứ 2</div>
								<div className="board-column-content-wrapper">
									<div className="board-column-content">
										<BoardItem
											subject="abc-1"
											teacher="abc"
											lessonCount={3}
											data-lessonCount="3"
										/>
										<BoardItem
											subject="abc-2"
											teacher="abc"
											lessonCount={2}
											data-lessonCount="2"
										/>
									</div>
									<div className="board-column-content">
										<BoardItem subject="abc-4" teacher="abc" />
										<BoardItem subject="abc-5" teacher="abc" />
										<BoardItem subject="abc-6" teacher="abc" />
										<BoardItem subject="abc-7" teacher="abc" />
										<BoardItem subject="abc-8" teacher="abc" />
									</div>
								</div>
							</div>
						</div>
						<div className="board-column tue">
							<div className="board-column-container">
								<div className="board-column-header">Thứ 3</div>
								<div className="board-column-content-wrapper">
									<div className="board-column-content">
										<BoardItem subject="abc-9" teacher="abc" />
										<BoardItem subject="abc-10" teacher="abc" />
										<BoardItem subject="abc-11" teacher="abc" />
									</div>
									<div className="board-column-content">
										<BoardItem subject="abc-12" teacher="abc" />
										<BoardItem subject="abc-13" teacher="abc" />
										<BoardItem subject="abc-14" teacher="abc" />
										<BoardItem subject="abc-15" teacher="abc" />
										<BoardItem subject="abc-16" teacher="abc" />
									</div>
								</div>
							</div>
						</div>
						<div className="board-column wed">
							<div className="board-column-container">
								<div className="board-column-header">Thứ 4</div>
								<div className="board-column-content-wrapper">
									<div className="board-column-content">
										<BoardItem subject="abc-17" teacher="abc" />
										<BoardItem subject="abc-18" teacher="abc" />
										<BoardItem subject="abc-19" teacher="abc" />
									</div>
									<div className="board-column-content">
										<BoardItem subject="abc-20" teacher="abc" />
										<BoardItem subject="abc-21" teacher="abc" />
										<BoardItem subject="abc-22" teacher="abc" />
										<BoardItem subject="abc-23" teacher="abc" />
										<BoardItem subject="abc-24" teacher="abc" />
									</div>
								</div>
							</div>
						</div>
						<div className="board-column thu">
							<div className="board-column-container">
								<div className="board-column-header">Thứ 5</div>
								<div className="board-column-content-wrapper">
									<div className="board-column-content">
										<BoardItem subject="abc-25" teacher="abc" />
										<BoardItem subject="abc-26" teacher="abc" />
										<BoardItem subject="abc-27" teacher="abc" />
									</div>
									<div className="board-column-content">
										<BoardItem subject="abc-28" teacher="abc" />
										<BoardItem subject="abc-29" teacher="abc" />
										<BoardItem subject="abc-30" teacher="abc" />
										<BoardItem subject="abc-31" teacher="abc" />
										<BoardItem subject="abc-32" teacher="abc" />
									</div>
								</div>
							</div>
						</div>
						<div className="board-column fri">
							<div className="board-column-container">
								<div className="board-column-header">Thứ 6</div>
								<div className="board-column-content-wrapper">
									<div className="board-column-content">
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
									</div>
									<div className="board-column-content">
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
									</div>
								</div>
							</div>
						</div>
						<div className="board-column sat">
							<div className="board-column-container">
								<div className="board-column-header">Thứ 7</div>
								<div className="board-column-content-wrapper">
									<div className="board-column-content">
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
									</div>
									<div className="board-column-content">
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
									</div>
								</div>
							</div>
						</div>
						<div className="board-column sun">
							<div className="board-column-container">
								<div className="board-column-header">Chủ Nhật</div>
								<div className="board-column-content-wrapper">
									<div className="board-column-content">
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
									</div>
									<div className="board-column-content">
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
										<BoardItem subject="abc" teacher="abc" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default TeacherTimeTable;
