import React from "react";
import "./App.css";
import Logo from "./components/Logo";
import Loading from "./components/Loading";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

class App extends React.Component {
	state = {
		loading: true,
		startDate: new Date(),
		endDate: new Date(),
	};

	componentDidMount() {
		// Nhớ timerHandle
		this.timerHandle = setTimeout(() => {
			this.setState({loading: false});
			this.timerHandle = 0;
		}, 2000);
	}

	componentWillUnmount() {
		// timerHandle có đang chạy không?
		if (this.timerHandle) {
			// Có thì clear nó
			clearTimeout(this.timerHandle);
			this.timerHandle = 0;
		}
	}

	render() {
		return (
			<>
				{
					// loading không?
					this.state.loading ? (
						// Có
						<Loading />
					) : (
						// Không
						<div className="App">
							{/* <header className="App-header">
								<Logo />
								<p>
									Chỉnh sửa code trong <code>src/App.js</code> and save to
									reload.
								</p>
								<a
									className="App-link"
									href="https://reactjs.org"
									target="_blank"
									rel="noopener noreferrer"
								>
									Learn React
								</a>
							</header> */}
							<main>
								<div>
									<Calendar
										value={this.state.startDate}
										onChange={(date) => this.setState({startDate: date})}
										locale="vi-VN"
										nextLabel={<i className="fas fa-angle-right" />}
										next2Label={<i className="fas fa-angle-double-right" />}
										prevLabel={<i className="fas fa-angle-left" />}
										prev2Label={<i className="fas fa-angle-double-left" />}
									/>

									<Calendar
										value={this.state.endDate}
										onChange={(date) => this.setState({endDate: date})}
										locale="vi-VN"
										nextLabel={<i className="fas fa-angle-right" />}
										next2Label={<i className="fas fa-angle-double-right" />}
										prevLabel={<i className="fas fa-angle-left" />}
										prev2Label={<i className="fas fa-angle-double-left" />}
									/>
									<p>{this.state.startDate.toLocaleDateString()}</p>
									<p>{this.state.endDate.toLocaleDateString()}</p>
									<p>
										{Math.floor(
											(this.state.endDate.getDate() -
												this.state.startDate.getDate()) /
												7
										)}{" "}
										tuần
									</p>
								</div>
							</main>
						</div>
					)
				}
			</>
		);
	}
}

export default App;
