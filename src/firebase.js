import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import {toast} from "react-toastify";

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

function titleCase(str) {
	var splitStr = str.toLowerCase().split(" ");
	for (var i = 0; i < splitStr.length; i++) {
		// You do not need to check if i is larger than splitStr length, as your for does that for you
		// Assign it back to the array
		splitStr[i] =
			splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	// Directly return the joined string
	return splitStr.join(" ");
}

const defaultFailCB = (err) => toast.error("🚫 Lỗi: " + err + "!");
const defaultSuccessCB = () => toast.success("✌ Thành Công!");

//#region Semester: Quản lý kì học

// write new semester or modify in database
export const setNewSemester = (values) => {
	Object.keys(values).map((key) => (values[key] = values[key].trim()));
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

export const removeSemester = (
	semID,
	successCB = defaultSuccessCB,
	failCB = defaultFailCB
) => {
	auth.onAuthStateChanged((user) => {
		if (user) {
			userRef(user.uid)
				.child(`semesters/${semID}`)
				.remove((err) => (err ? failCB(err.message) : successCB()));
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
	Object.keys(values).map((key) => (values[key] = values[key].trim()));
	if (values["faculty-name"]) {
		let object = values;
		let facID = object["faculty-id"];
		delete object["faculty-id"];
		object["faculty-name"] = titleCase(object["faculty-name"]);

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
export const removeFaculty = (
	id,
	successCB = defaultSuccessCB,
	failCB = defaultFailCB
) => {
	if (id) {
		auth.onAuthStateChanged((user) => {
			if (user) {
				userRef(user.uid)
					.child(`faculties/${id}`)
					.remove((err) => (err ? failCB(err.message) : successCB()));
			}
		});
	} else {
		failCB("Không có khoa nào được chọn");
	}
};

//#endregion

//#region Lectures: Quản lý nhân sự, giảng viên

// get all lectures in database
export function getAllLectures(callback) {
	auth.onAuthStateChanged((user) => {
		if (user) {
			userRef(user.uid)
				.child("lectures")
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

// set new lectures
export function newLecture(values) {
	Object.keys(values).map((key) => (values[key] = values[key].trim()));
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
export function modifyLecture(
	id,
	values,
	successCB = defaultSuccessCB,
	failCB = defaultFailCB
) {
	Object.keys(values).map((key) => (values[key] = values[key].trim()));
	auth.onAuthStateChanged((user) => {
		if (user) {
			userRef(user.uid)
				.child(`lectures/${id}`)
				.set(values, (err) => {
					err ? failCB(err.message) : successCB();
				});
		}
	});
}

// remove lecture by id
export const removeLecture = (
	id,
	successCB = defaultSuccessCB,
	failCB = defaultFailCB
) => {
	if (id) {
		auth.onAuthStateChanged((user) => {
			if (user) {
				userRef(user.uid)
					.child(`lectures/${id}`)
					.remove((err) => (err ? failCB(err) : successCB()));
			}
		});
	} else {
		console.warn("No Lectures ID was set!");
	}
};

//#endregion

//#region Subjects: Quản lý môn học

// get all subjects in database
export function getAllSubjects(callback) {
	auth.onAuthStateChanged((user) => {
		if (user) {
			userRef(user.uid)
				.child("subjects")
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

// set new subject
export function newSubject(values) {
	if (!!values["subject-name"]) {
		Object.keys(values).map((key) => (values[key] = values[key].trim()));
		values["subject-name"] = values["subject-name"].toString().toUpperCase();
	}
	auth.onAuthStateChanged((user) => {
		if (user) {
			userRef(user.uid)
				.child("subjects")
				.push(values, (err) => {
					err ? console.warn(err) : console.log("newSubject success!");
				});
		}
	});
}

// modify lecture by id
export function modifySubject(
	id,
	values,
	successCB = defaultSuccessCB,
	failCB = defaultFailCB
) {
	if (!!values["subject-name"]) {
		Object.keys(values).map((key) => (values[key] = values[key].trim()));
		values["subject-name"] = values["subject-name"].toString().toUpperCase();
	}
	auth.onAuthStateChanged((user) => {
		if (user) {
			userRef(user.uid)
				.child(`subjects/${id}`)
				.set(values, (err) => (err ? failCB(err.message) : successCB()));
		}
	});
}

// remove lecture by id
export const removeSubject = (
	id,
	successCB = defaultSuccessCB,
	failCB = defaultFailCB
) => {
	if (id) {
		auth.onAuthStateChanged((user) => {
			if (user) {
				userRef(user.uid)
					.child(`subjects/${id}`)
					.remove((err) => (err ? failCB(err.message) : successCB()));
			}
		});
	} else {
		console.warn("No Subject ID was set!");
	}
};

//#endregion
