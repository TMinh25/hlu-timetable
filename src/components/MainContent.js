import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// import styles
import "./MainContent.css";

class MainContent extends React.Component {
	render() {
		return (
			<div className="main-content">
				<p>Home</p>
				{/* <FullCalendar
					plugins={[timeGridPlugin, interactionPlugin]}
					initialView="timeGridWeek"
					titleFormat={{year: "numeric", month: "long", day: "numeric"}}
					headerToolbar={{start: "today", center: "title", end: "prev,next"}}
					buttonText={{
						today: "Hôm nay",
						month: "Tháng",
						week: "Tuần",
						day: "Ngày",
						list: "Danh sách",
					}}
					scrollTime="07:00:00"
					slotDuration="00:45:00"
					selectable={true}
					nowIndicator={true}
					businessHours={[{allDay: false}]}
					dateClick={(dateClickInfo) => {
						console.log(dateClickInfo.dateStr);
					}}
					locale="vi"
					events={[{title: "event 1", date: "2020-12-15"}]}
				/> */}
				<table id="time-table__table">
					<thead>
						<tr>
							<th colSpan={2}>Thời Gian</th>
							<th colSpan={2}>Thứ Hai</th>
							<th colSpan={2}>Thứ Ba</th>
							<th colSpan={2}>Thứ Tư</th>
							<th colSpan={2}>Thứ Năm</th>
							<th colSpan={2}>Thứ Sáu</th>
							<th colSpan={2}>Thứ Bảy</th>
							<th colSpan={2}>Chủ Nhật</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>BĐ</td>
							<td>KT</td>
							<td>Học Phần</td>
							<td>Giảng Viên</td>
							<td>Học Phần</td>
							<td>Giảng Viên</td>
							<td>Học Phần</td>
							<td>Giảng Viên</td>
							<td>Học Phần</td>
							<td>Giảng Viên</td>
							<td>Học Phần</td>
							<td>Giảng Viên</td>
							<td>Học Phần</td>
							<td>Giảng Viên</td>
							<td>Học Phần</td>
							<td>Giảng Viên</td>
						</tr>
						<tr>
							<td>7:00</td>
							<td>7:50</td>
							<td colSpan={2}>
								<div className=""></div>
							</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

export default MainContent;
