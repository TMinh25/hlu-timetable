import React, { Component, createContext } from "react";

// import components
import { auth, userRef } from "../firebase";

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
      this.setState({ user: newUser }, () => {
        if (!!newUser) {
          // console.log("User: ");
          // console.log(this.state);
        }
      });
    };
  }

  componentDidMount = () => {
    // check if the user has changed and setState to the {user}
    auth.onAuthStateChanged((user) => {
      if (!!user) {
        console.log("signed in");
        this.setUser(user);
        userRef(user.uid)
          .child("setting/")
          .set({ "loged-history": new Date().toString() }, (err) => {
            if (err) {
              console.warn("failed to write data to firebase: " + err.message);
            }
          });
      } else {
        console.log("not signed in");
        this.setUser(null);
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
