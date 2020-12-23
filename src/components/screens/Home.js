import React from "react";

// import components
import LeftMenu from "../LeftMenu";
import MainContent from "../MainContent";
import NavBar from "../NavBar";

// import styles
import "./Home.css";

// class Home extends React.Component {
const Home = () => {
	// constructor() {
	// 	super();
	// 	this.state = {
	// 		leftMenuVisible: true,
	// 	};
	// 	this.handleHamburgerClick = this.handleHamburgerClick.bind(this);
	// }

	const [leftMenuVisible, setLeftMenuVisible] = React.useState(true);

	const handleHamburgerClick = () => {
		// this.setState((prevState) => ({leftMenuVisible: !prevState}));
		setLeftMenuVisible((prev) => !prev);
	};

	// render() {
	return (
		<>
			<NavBar to="/" onHamburgerClick={handleHamburgerClick} showHamburger={true} />
			<main className="content">
				<LeftMenu visible={leftMenuVisible} />
				<MainContent />
			</main>
		</>
	);
	// }
};

export default Home;
