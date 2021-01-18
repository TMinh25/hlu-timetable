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
// export const currentUser = () =>
// 	auth.onAuthStateChanged((user) => {
// 		if (user) {
// 			return user;
// 		} else {
// 			return null;
// 		}
// 	});

export const userRef = (userID) => database.ref(userID);

export const currentUserQuery = () => {
	auth.onAuthStateChanged((user) => {
		if (user) {
			return userRef(user.uid);
		}
	});
	return;
};

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

//#region Semester: Quản lý kì học

// write new semester or modify in database
export const setNewSemester = (values) => {
	auth.onAuthStateChanged((user) => {
		userRef(user.uid)
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
	});
};

export const removeSemester = (semID) => {
	auth.onAuthStateChanged((user) => {
		if (user) {
			userRef(user.uid)
				.child(`semesters/${semID}`)
				.remove((err) => {
					if (err) {
						console.warn("failed to remove: " + err);
					}
				});
		}
	});
};

//#endregion

//#region Faculties: Quản Lý Khoa

// get all faculties in database
export function getAllFaculties(callback) {
	auth.onAuthStateChanged((user) => {
		if (!!user) {
			userRef(user.uid)
				.child("faculties")
				.on("value", (snapshot) => {
					if (snapshot.val() != null) {
						callback(snapshot.val());
					} else {
						callback({});
					}
				});
		}
	});
}

// add and modify faculty to database
export const setNewFaculty = (values) => {
	if (values["faculty-name"]) {
		let object = values;
		let facID = object["faculty-id"];
		delete object["faculty-id"];

		auth.onAuthStateChanged((user) => {
			if (user) {
				userRef(user.uid)
					.child(`faculties/${facID}`)
					.set(object, (err) => {
						if (err) {
							console.warn(err);
						}
					});
			}
		});
	}
};

// remove faculty
export const removeFaculty = (id) => {
	if (id) {
		auth.onAuthStateChanged((user) => {
			if (user) {
				userRef(user.uid)
					.child(`faculties/${id}`)
					.remove((err) => {
						if (err) {
							console.warn("failed to remove: " + err);
						}
					});
			}
		});
	} else {
		console.warn("No Faculty ID was set!");
	}
};

// get faculties list in database
// export const getAllFaculties = () => {
// 	auth.onAuthStateChanged((user) => {
// 		if (user) {
// 			userRef(user.uid)
// 				.child("faculties")
// 				.on("value", (snapshot) => {
// 					if (snapshot.val() != null) {
// 						console.log(snapshot.val());
// 						return snapshot.val();
// 					} else {
// 						return {};
// 					}
// 				});
// 		}
// 	});
// };

//#endregion

//#region Lectures: Quản lý nhân sự, giảng viên

// get all lectures in database
export function getAllLectures(callback) {
	auth.onAuthStateChanged((user) => {
		if (user) {
			userRef(user.uid)
				.child("faculties")
				.once("value", (snapshot) => {
					if (snapshot.val() !== null) {
						callback(snapshot.val());
					} else {
						callback({});
					}
				});
		}
	});
}

// set new or modify lectures
export function newLecture(values) {
	auth.onAuthStateChanged((user) => {
		if (user) {
			userRef(user.uid)
				.child("lectures")
				.push(values, (err) => {
					err ? console.warn(err) : console.log("newLecture success!");
				});
		}
	});
}

// modify lecture by id
export function modifyLecture({id, values}) {
	auth.onAuthStateChanged((user) => {
		if (user) {
			userRef(user.uid)
				.child(`lectures/${id}`)
				.set(values, (err) => {
					err ? console.warn(err) : console.log("modifyLecture success!");
				});
		}
	});
}

// remove lecture by id

// remove faculty
export const removeLecture = ({id}) => {
	if (id) {
		auth.onAuthStateChanged((user) => {
			if (user) {
				userRef(user.uid)
					.child(`lectures/${id}`)
					.remove((err) => {
						if (err) {
							console.warn("failed to remove: " + err);
						}
					});
			}
		});
	} else {
		console.warn("No Lecture ID was set!");
	}
};

//#endregion
