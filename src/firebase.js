import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { titleCase, defaultSuccessCB, defaultFailCB } from "./utils";

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

export const auth = firebase.auth();
export var database = firebase.database();

export const userRef = (userID) => database.ref(userID);

export function currentUserQuery() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      return userRef(user.uid);
    }
  });
  return;
}

// change the loged in user
export function signInWithGoogle() {
  var googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  googleAuthProvider.setCustomParameters({
    prompt: "select_account",
  });
  return auth.signInWithPopup(googleAuthProvider);
}

// sign out current user
export function signOut(callback) {
  auth
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("Sign-out successful.");
      callback();
    })
    .catch((err) => {
      // An error happened.
      console.log("Sign-out unsuccessful: " + err);
    });
}

//#region Semester: Quản lý lớp

// write new semester or modify in database

export function getAllClass(semID) {
  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      if (!!user) {
        userRef(user.uid)
          .child(`semesters/${semID}/classes`)
          .on("value", (snapshot) => {
            if (snapshot.val() != null) {
              resolve(snapshot.val());
            } else {
              resolve({});
            }
          });
      }
    });
  });
}

export function setNewClass(semID, values) {
  Object.keys(values).forEach(
    (key) => (values[key] = values[key].toString().toString().trim())
  );

  // console.warn(copiedObj, values);

  auth.onAuthStateChanged((user) => {
    userRef(user.uid)
      .child(`semesters/${semID}/classes/`)
      .push(values, (err) => {
        // failed to write data
        err
          ? console.warn("failed to write data to firebase: " + err.message)
          : console.log("setNewClass success!");
      });
  });
}

export function removeClass(
  semID,
  classID,
  successCB = defaultSuccessCB,
  failCB = defaultFailCB
) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      userRef(user.uid)
        .child(`semesters/${semID}/classes/${classID}`)
        .remove((err) => {
          if (err) {
            failCB(err.message);
          } else {
            successCB();
            console.log("removeClass success!");
          }
        });
    }
  });
}

//#endregion

//#region Semester: Quản lý kì học

// write new semester or modify in database

export function getAllSemester(callback) {
  auth.onAuthStateChanged((user) => {
    if (!!user) {
      userRef(user.uid)
        .child("semesters")
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

export function setNewSemester(values) {
  Object.keys(values).forEach(
    (key) => (values[key] = values[key].toString().toString().trim())
  );
  auth.onAuthStateChanged((user) => {
    userRef(user.uid)
      .child(`semesters`)
      .push()
      .child("semesterInfo")
      .set(
        values,
        // failed to write data
        (err) => {
          if (err) {
            console.warn("failed to write data to firebase: " + err.message);
          } else {
            console.log("setNewSemester success!");
          }
        }
      );
  });
}

export function removeSemester(
  semID,
  successCB = defaultSuccessCB,
  failCB = defaultFailCB
) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      userRef(user.uid)
        .child(`semesters/${semID}`)
        .remove((err) => {
          if (err) {
            failCB(err.message);
          } else {
            successCB();
            console.log("removeSemester success!");
          }
        });
    }
  });
}

//#endregion

//#region Faculties: Quản Lý Khoa

// get all faculties in database
export function getAllFaculties() {
  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      if (!!user) {
        userRef(user.uid)
          .child("faculties")
          .on("value", (snapshot) => {
            if (snapshot.val() != null) {
              resolve(snapshot.val());
            } else {
              resolve({});
            }
          });
      }
    });
  });
}

// add and modify faculty to database
export function setNewFaculty(values, failCB = defaultFailCB) {
  Object.keys(values).forEach((key) => {
    if (!!values[key]) {
      values[key] = values[key].toString().trim();
    }
  });
  if (values["faculty-name"]) {
    let facID = values["faculty-id"];
    // remove the faculty-id prop from object and use it as key
    delete values["faculty-id"];
    values["faculty-name"] = titleCase(values["faculty-name"]);

    auth.onAuthStateChanged((user) => {
      if (user) {
        userRef(user.uid)
          .child(`faculties/${facID}`)
          .set(values, (err) =>
            err ? failCB(err.message) : console.log("setNewFaculty success")
          );
      }
    });
  }
}

// remove faculty
export function removeFaculty(
  id,
  successCB = defaultSuccessCB,
  failCB = defaultFailCB
) {
  if (id) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        userRef(user.uid)
          .child(`faculties/${id}`)
          .remove((err) => {
            if (err) {
              failCB(err.message);
            } else {
              successCB();
              console.log("removeFaculty success!");
            }
          });
      }
    });
  } else {
    failCB("Không có khoa nào được chọn");
  }
}

//#endregion

//#region Lectures: Quản lý nhân sự, giảng viên

// get all lectures in database
export function getAllLectures() {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        userRef(user.uid)
          .child("lectures")
          .once("value", (snapshot) => {
            if (snapshot.val() !== null) {
              resolve(snapshot.val());
            } else {
              resolve({});
            }
          });
      }
    });
  });
}

// set new lectures
export function newLecture(values) {
  Object.keys(values).forEach((key) => {
    if (!!values[key]) {
      values[key] = values[key].toString().trim();
    }
  });
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
  Object.keys(values).forEach(
    (key) => (values[key] = values[key].toString().trim())
  );
  auth.onAuthStateChanged((user) => {
    if (user) {
      userRef(user.uid)
        .child(`lectures/${id}`)
        .set(values, (err) => {
          if (err) {
            failCB(err.message);
          } else {
            successCB();
            console.log("modifyLecture success!");
          }
        });
    }
  });
}

// remove lecture by id
export function removeLecture(
  id,
  successCB = defaultSuccessCB,
  failCB = defaultFailCB
) {
  if (id) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        userRef(user.uid)
          .child(`lectures/${id}`)
          .remove((err) => {
            if (err) {
              failCB(err);
            } else {
              successCB();
              console.log("removeLecture success!");
            }
          });
      }
    });
  } else {
    console.warn("Không có ID giảng viên!");
  }
}

//#endregion

//#region Subjects: Quản lý môn học

// get all subjects in database
export function getAllSubjects() {
  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        userRef(user.uid)
          .child("subjects")
          .once("value", (snapshot) => {
            if (snapshot.val() !== null) {
              resolve(snapshot.val());
            } else {
              resolve({});
            }
          });
      }
    });
  });
}

// set new subject
export function newSubject(values) {
  if (!!values["subject-name"]) {
    Object.keys(values).forEach((key) => {
      if (!!values[key]) {
        values[key] = values[key].toString().trim();
      }
    });
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
    Object.keys(values).forEach(
      (key) => (values[key] = values[key].toString().trim())
    );
    values["subject-name"] = values["subject-name"].toString().toUpperCase();
  }
  auth.onAuthStateChanged((user) => {
    if (user) {
      userRef(user.uid)
        .child(`subjects/${id}`)
        .set(values, (err) => {
          if (err) {
            failCB(err.message);
          } else {
            successCB();
            console.log("modifySubject success!");
          }
        });
    }
  });
}

// remove lecture by id
export function removeSubject(
  id,
  successCB = defaultSuccessCB,
  failCB = defaultFailCB
) {
  if (id) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        userRef(user.uid)
          .child(`subjects/${id}`)
          .remove((err) => {
            if (err) {
              failCB(err.message);
            } else {
              successCB();
              console.log("removeSubject success!");
            }
          });
      }
    });
  } else {
    console.warn("Không có môn học nào được chọn!");
  }
}

//#endregion

//#region Assignments: Quản lý phân công giảng dạy

export function getAssignmentsOfLecture(semID, currentLectureID) {
  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      userRef(user.uid)
        .child(`semesters/${semID}/assignments/${currentLectureID}/`)
        .once("value", (snapshot) => {
          if (snapshot.val() !== null) {
            resolve(snapshot.val());
          } else {
            resolve({});
          }
        });
    });
  });
}

export function setNewAssignment(semID, currentLectureID, values) {
  auth.onAuthStateChanged((user) => {
    userRef(user.uid)
      .child(`semesters/${semID}/assignments/${currentLectureID}/`)
      .set(values, (err) => {
        // failed to write data
        err
          ? console.warn("failed to write data to firebase: " + err.message)
          : console.log("setNewAssignment success!");
      });
  });
}

//#endregion
