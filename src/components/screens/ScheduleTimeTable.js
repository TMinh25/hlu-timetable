import React from "react";

// import components
import Muuri from "muuri";

// import styles
import "./ScheduleTimeTable.css";

const ScheduleTimeTable = () => {
	React.useEffect(() => {
		var dragContainer = document.querySelector(".drag-container");
		var itemContainers = [].slice.call(
			document.querySelectorAll(".board-column-content")
		);
		var columnGrids = [];

		// Init the column grids so we can drag those items around.
		itemContainers.forEach((container) => {
			var grid = new Muuri(container, {
				items: ".board-item",
				dragEnabled: true,
				dragAxis: "xy",
				dragPlaceholder: { enabled: true },
				dragSort: function () {
					return columnGrids;
				},
				dragContainer: document.body,
				dragAutoScroll: {
					targets: (item) => {
						return [
							{ element: window, priority: 0 },
							{ element: item.getGrid().getElement().parentNode, priority: 1 },
						];
					},
				},
				dragRelease: {
					duration: 100,
					easing: "ease",
					useDragContainer: true,
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
				});

			columnGrids.push(grid);
		});
	}, []);

	// var columns = document.getElementsByClassName("board-column-content");

	// const BoardItem = ({subject, teacher, lessonCount}) => {
	// 	const [height, setHeight] = React.useState();

	// 	React.useEffect(() => setHeight(lessonCount * 30), []);

	// 	return (
	// 		<div
	// 			className="board-item"
	// 			style={{height: `${height}px`}}
	// 			data-lessonCount={lessonCount}
	// 		>
	// 			<div className="board-item-content">
	// 				<span className="board-item-content-subject">{subject}</span>
	// 				<br />
	// 				<span className="board-item-content-teacher">{teacher}</span>
	// 			</div>
	// 		</div>
	// 	);
	// };

	return (
		<>
			<div className="main-content">
				<div className="board">
					<div className="board-column mon">
						<div className="board-column-container">
							<div className="board-column-header">Thứ 2</div>
							<div className="board-column-content-wrapper">
								<div className="board-column-content">
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>1
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>2
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>3
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>4
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>5
										</div>
									</div>
								</div>
								<div className="board-column-content">
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>1
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>2
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>3
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>4
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>5
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="board-column tue">
						<div className="board-column-container">
							<div className="board-column-header">Thứ 3</div>
							<div className="board-column-content-wrapper">
								<div className="board-column-content">
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>1
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>2
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>3
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>4
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>5
										</div>
									</div>
								</div>
								<div className="board-column-content">
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>1
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>2
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>3
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>4
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>5
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="board-column wed">
						<div className="board-column-container">
							<div className="board-column-header">Thứ 4</div>
							<div className="board-column-content-wrapper">
								<div className="board-column-content">
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>1
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>2
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>3
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>4
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>5
										</div>
									</div>
								</div>
								<div className="board-column-content">
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>1
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>2
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>3
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>4
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>5
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="board-column thu">
						<div className="board-column-container">
							<div className="board-column-header">Thứ 5</div>
							<div className="board-column-content-wrapper">
								<div className="board-column-content">
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>1
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>2
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>3
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>4
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>5
										</div>
									</div>
								</div>
								<div className="board-column-content">
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>1
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>2
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>3
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>4
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>5
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="board-column fri">
						<div className="board-column-container">
							<div className="board-column-header">Thứ 6</div>
							<div className="board-column-content-wrapper">
								<div className="board-column-content">
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>1
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>2
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>3
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>4
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>5
										</div>
									</div>
								</div>
								<div className="board-column-content">
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>1
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>2
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>3
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>4
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>5
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="board-column sat">
						<div className="board-column-container">
							<div className="board-column-header">Thứ 7</div>
							<div className="board-column-content-wrapper">
								<div className="board-column-content">
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>1
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>2
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>3
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>4
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>5
										</div>
									</div>
								</div>
								<div className="board-column-content">
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>1
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>2
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>3
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>4
										</div>
									</div>
									<div className="board-item">
										<div className="board-item-content">
											<span>Item #</span>5
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="board-column sun">
						<div className="board-column-container">
							<div className="board-column-header">
								<span>Chủ Nhật</span>
							</div>
							<div className="board-column-content-wrapper">
								<div className="board-column-content"></div>
								<div className="board-column-content"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ScheduleTimeTable;
