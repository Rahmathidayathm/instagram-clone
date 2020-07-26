import React, { useState } from "react";
import firebase from "firebase";
import { db, storage } from "./firebase";
import { Button } from "@material-ui/core";

import "./ImageUpload.css";

const ImageUpload = ({ username }) => {
	const [caption, setCaption] = useState("");
	const [image, setImage] = useState("");
	const [progress, setProgress] = useState(0);

	const handleSubmit = (e) => {
		e.preventDefault();

		const uploadTask = storage.ref(`images/${image.name}`).put(image);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 1000
				);
				setProgress(progress);
			},
			(error) => {
				console.log(error);
				alert(error.message);
			},
			() => {
				storage
					.ref("images")
					.child(image.name)
					.getDownloadURL()
					.then((url) => {
						db.collection("posts").add({
							timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							caption: caption,
							imageUrl: url,
							username: username,
						});

						setImage("");
						setCaption("");
						setProgress(0);
					});
			}
		);
	};

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	return (
		<div className="imageUpload">
			<form className="post__upload" onSubmit={handleSubmit}>
				{/*caption input*/}
				<progress value={progress} max="100" className="upload__progress" />
				<input
					type="text"
					onChange={(e) => setCaption(e.target.value)}
					placeholder="Enter caption"
				/>
				{/*file picker*/}
				<input type="file" onChange={handleChange} />
				{/*button upload*/}
				<Button>upload</Button>
			</form>
		</div>
	);
};

export default ImageUpload;
