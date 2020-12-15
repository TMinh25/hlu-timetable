import React from "react";

// import components
import Logo from "./Logo";

// import styles
import "./NavBar.css";

class NavBar extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<nav className="navbar">
				<span className="navbar-mainmenu" onClick={this.props.onHamburgerClick}>
					<i class="fas fa-bars"></i>
				</span>
				<Logo
					style={this.props.onLogoClick && {cursor: "pointer"}}
					to={this.props.to}
				/>
			</nav>
		);
	}
}

export default NavBar;
