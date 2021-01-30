import React from "react";

// import components
import MainContent from "../MainContent";

// import styles
import "./Home.css";
import "./management/Manage.css"

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

	return (
		<>
			<MainContent />
		</>
	);
};

export default Home;
