import React from "react";

// import components
import NavBar from "../NavBar";
import LeftMenu from "../LeftMenu";
import Muuri from "muuri";

// import styles
import "./AllocateManagement.css";

const AllocateManagement = () => {
	const [leftMenuVisible, setLeftMenuVisible] = React.useState(true);

	const handleHamburgerClick = () => {
		setLeftMenuVisible((prev) => !prev);
	};

	// create drag table with Muuri
	React.useEffect(() => {
		var dragContainer = document.querySelector(".drag-container");
		var itemContainers = [].slice.call(
			document.querySelectorAll(".board-column-content")
		);
		var columnGrids = [];
		// var boardGrid;

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
				// .on("layoutStart", function () {
				// 	boardGrid.refreshItems().layout();
				// })
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
		// boardGrid = new Muuri(".board", {
		// dragEnabled: false,
		// });
	}, []);

	var columns = document.getElementsByClassName("board-column-content");

	const BoardItem = ({subject, teacher, lessonCount}) => {
		const [height, setHeight] = React.useState();

		React.useEffect(() => setHeight(lessonCount * 30), []);

		return (
			<div
				className="board-item"
				style={{height: `${height}px`}}
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
			<div className="main-content">
				<div class="drag-container"></div>
				<div class="board">
					<div class="board-column todo">
						<div class="board-column-container">
							<div class="board-column-header">Todo</div>
							<div class="board-column-content-wrapper">
								<div class="board-column-content">
									<div class="board-item">
										<div class="board-item-content">
											<span>Item #</span>1
										</div>
									</div>
									<div class="board-item">
										<div class="board-item-content">
											<span>Item #</span>2
										</div>
									</div>
									<div class="board-item">
										<div class="board-item-content">
											<span>Item #</span>3
										</div>
									</div>
									<div class="board-item">
										<div class="board-item-content">
											<span>Item #</span>4
										</div>
									</div>
									<div class="board-item">
										<div class="board-item-content">
											<span>Item #</span>5
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="board-column working">
						<div class="board-column-container">
							<div class="board-column-header">Working</div>
							<div class="board-column-content-wrapper">
								<div class="board-column-content">
									<div class="board-item">
										<div class="board-item-content">
											<span>Item #</span>6
										</div>
									</div>
									<div class="board-item">
										<div class="board-item-content">
											<span>Item #</span>7
										</div>
									</div>
									<div class="board-item">
										<div class="board-item-content">
											<span>Item #</span>8
										</div>
									</div>
									<div class="board-item">
										<div class="board-item-content">
											<span>Item #</span>9
										</div>
									</div>
									<div class="board-item">
										<div class="board-item-content">
											<span>Item #</span>10
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="board-column done">
						<div class="board-column-container">
							<div class="board-column-header">Done</div>
							<div class="board-column-content-wrapper">
								<div class="board-column-content">
									<div class="board-item">
										<div class="board-item-content">
											<span>Item #</span>11
										</div>
									</div>
									<div class="board-item">
										<div class="board-item-content">
											<span>Item #</span>12
										</div>
									</div>
									<div class="board-item">
										<div class="board-item-content">
											<span>Item #</span>13
										</div>
									</div>
									<div class="board-item">
										<div class="board-item-content">
											<span>Item #</span>14
										</div>
									</div>
									<div class="board-item">
										<div class="board-item-content">
											<span>Item #</span>15
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AllocateManagement;
