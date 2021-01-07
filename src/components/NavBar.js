import React, {useContext, useState, useEffect} from "react";
import {signInWithGoogle, signOut} from "../firebase";

// import components
import Logo from "./Logo";
import {UserContext} from "../providers/UserProvider";
import {Button} from "./Button";

// import styles
import "./NavBar.css";

const NavBar = ({onLogoClick, onHamburgerClick, showHamburger}) => {
	const user = useContext(UserContext);

	const [showModule, setShowModule] = useState(false);

	const toggleModule = () => {
		setShowModule((prevState) => !prevState);
	};

	useEffect(() => {
		console.log(showModule);
	}, [showModule]);

	// hide NavModule on mount
	useEffect(() => {
		if (!user) {
			setShowModule(false);
		} else {
			setShowModule(false);
		}
	}, [user]);

	const NavModule = (props) => {
		// click outside to close module method
		const onClickOutsideListener = () => {
			setShowModule(false);
			// removeEventListener to not listen to document.click when module is closed
			document.removeEventListener("click", onClickOutsideListener);
		};

		return (
			<div
				className={props.showModule ? "" : "hide"}
				id="nav__module"
				onMouseLeave={() => {
					// if mouse leave the element then addEventListener
					// to listen to document.click
					document.addEventListener("click", onClickOutsideListener);
				}}
			>
				<section id="module-info-sect">
					<div className="big-avatar-container">
						<img
							src={
								user.photoURL ||
								"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
							}
							alt="avatar"
						/>
					</div>
					<h4 className="display-name">{user.displayName}</h4>
					<p className="display-email">{user.email}</p>
				</section>
				<section id="module-signout-sect">
					<div>
						<Button
							className="new module-btn"
							onClick={() => signInWithGoogle()}
						>
							Chuyển <br /> tài khoản
						</Button>
					</div>
					<div>
						<Button className="sign-out module-btn" onClick={() => signOut()}>
							Đăng xuất
						</Button>
					</div>
				</section>
			</div>
		);
	};

	return (
		<>
			<nav className="navbar">
				{showHamburger && (
					<span className="navbar-mainmenu" onClick={onHamburgerClick}>
						<i className="fas fa-bars" />
					</span>
				)}

				<Logo style={onLogoClick && {cursor: "pointer"}} />

				<div className="sign-in-container">
					{!!user ? (
						<>
							{/* <div className="avatar-container" onClick={() => toggleModule()}> */}
							<img
								className="nav-avatar"
								src={
									user.photoURL ||
									"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
								}
								alt="avatar"
								onClick={() => toggleModule()}
							/>
							{/* </div> */}
						</>
					) : (
						<>
							<Button className="sign-in" onClick={() => signInWithGoogle()}>
								Đăng nhập
							</Button>
						</>
					)}
				</div>
				{!!user && <NavModule showModule={showModule} />}
			</nav>
		</>
	);
};

export default NavBar;
