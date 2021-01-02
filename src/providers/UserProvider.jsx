import React, {Component, createContext} from "react";
import {auth} from "../firebase";

export const UserContext = createContext({
	user: null,
});

class UserProvider extends Component {
	constructor() {
		super();
		this.state = {
			user: null,
		};

		// set new user
		this.setUser = (newUser) => {
			this.setState({user: newUser}, () => {
				console.log("new user: ");
				console.log(this.state.user);
			});
		};
	}

	componentDidMount = () => {
		// check if the user has changed and setState to the {user}
		auth.onAuthStateChanged((userAuth) => {
			if (!!userAuth) {
				console.log("signed in");
				this.setUser(userAuth);
			} else {
				console.log("not signed in");
				this.setUser(null)
			}
		});
	};

	render() {
		return (
			<UserContext.Provider value={this.state.user}>
				{this.props.children}
			</UserContext.Provider>
		);
	}
}

export default UserProvider;
