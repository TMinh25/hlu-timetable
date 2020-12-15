import React from "react";

// import components
import LeftMenu from "../LeftMenu";
import MainContent from "../MainContent";
import NavBar from "../NavBar";

// import styles
import "./Home.css";

class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			leftMenuVisible: true,
		};
		this.handleHamburgerClick = this.handleHamburgerClick.bind(this);
	}

	handleHamburgerClick() {
		this.setState((prev) => {
      console.log(prev);
      return ({leftMenuVisible: !prev})
    });
	}

	render() {
		return (
			<>
				<NavBar to="/" onHamburgerClick={this.handleHamburgerClick} />
				<main className="home-content">
					<LeftMenu visible={this.state.leftMenuVisible} />
					<MainContent />
				</main>
			</>
		);
	}
}

export default Home;
