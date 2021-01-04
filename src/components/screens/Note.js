import React from "react";
import {useParams} from "@reach/router";

// import component
import {userRef, auth} from "../../firebase";
import NotFound from "./NotFound";

const Note = (props) => {
	const [note, setNote] = React.useState({});

	React.useEffect(() => {
		if (props.noteId) {
			console.log(props.noteId);
		}
	}, [props.noteId]);

	React.useEffect(() => {
		if (!!auth.currentUser) {
			userRef(auth.currentUser.uid)
				.child(`note/${props.noteId}`)
				.on("value", (snapshot) => {
					if (snapshot.val() != null) {
						setNote({...snapshot.val()});
					} else {
						setNote({});
					}
				});
		}
	}, [auth.currentUser, props.noteId]); // similar to componentDidMount()

	return Object.keys(note).length ? (
		<>
			<div>
				<h1>note: {props.noteId}</h1>
				<p>id: {note.id}</p>
				<p>note: {note.note}</p>
			</div>
		</>
	) : (
		<NotFound />
	);
};

export default Note;
