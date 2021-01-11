import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

var firebaseConfig = {
	apiKey: "AIzaSyAvou0hUxm9CUqZUN7pRmq6ooHDqHy52x0",
	authDomain: "hlu-timetable.firebaseapp.com",
	databaseURL: "https://hlu-timetable-default-rtdb.firebaseio.com",
	projectId: "hlu-timetable",
	storageBucket: "hlu-timetable.appspot.com",
	messagingSenderId: "728227473654",
	appId: "1:728227473654:web:82ad634bdc4ae6cbfde4d7",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//  setPersistence(firebaseAuth.Auth.Persistence.LOCAL)
export const auth = firebase.auth();
export var database = firebase.database();
export const currentUser = () =>
	auth.onAuthStateChanged((user) => {
		if (user) {
			return user;
		} else {
			return null;
		}
	});

export const userRef = (userID) => database.ref(userID);

// change the loged in user
export const signInWithGoogle = () => {
	var googleAuthProvider = new firebase.auth.GoogleAuthProvider();
	googleAuthProvider.setCustomParameters({
		prompt: "select_account",
	});
	auth.signInWithPopup(googleAuthProvider);
};

// sign out current user
export const signOut = () => {
	auth
		.signOut()
		.then(() => {
			// Sign-out successful.
			console.log("Sign-out successful.");
		})
		.catch((err) => {
			// An error happened.
			console.log("Sign-out unsuccessful: " + err);
		});
};

// write notes in database
export const setNewSemester = (uid, values) => {
	userRef(uid)
		.child(`semesters`)
		.push()
		.child("semester-info")
		.set(
			values,
			// failed to write data
			(err) => {
				if (err) {
					console.warn("failed to write data to firebase: " + err.message);
				} else {
					// console.log(values);
				}
			}
		);
};

// add faculty to database
export const setNewFaculty = (facID, values) => {
	if (values["faculty-name"]) {
		let object = values;
		// let facultyId = object["faculty-id"];
		delete object["faculty-id"];

		auth.onAuthStateChanged((user) => {
			if (user) {
				userRef(user.uid).child(`faculties/${facID}`).set(object);
			}
		});
	}
};

// get faculties list in database
export const getAllFaculties = () => {
	auth.onAuthStateChanged((user) => {
		if (user) {
			userRef(user.uid)
				.child("faculties")
				.on("value", (snapshot) => {
					if (snapshot.val() != null) {
						console.log(snapshot.val());
						return snapshot.val();
					} else {
						return {};
					}
				});
		}
	});
};
