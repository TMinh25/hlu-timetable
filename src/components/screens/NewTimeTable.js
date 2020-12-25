import React from "react";

// import components
import NavBar from "../NavBar";

class NewTimeTable extends React.Component {
	render() {
		return (
			<>
				<NavBar to="/" />
				<main>
					<h1>Hãy bắt đầu tạo thời khóa biểu mới!</h1>
					<div>Đầu tiên hãy chọn thời gian của kì học của bạn</div>
				</main>
			</>
		);
	}
}

export default NewTimeTable;
