import React, { useState, useEffect } from "react";
import "./Post.css";

import { db } from "./firebase";
import { Avatar } from "@material-ui/core";
import firebase from "firebase";

const Post = ({
	userLoggedin,
	postId,
	username,
	caption,
	avatar,
	imageUrl,
}) => {
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState("");

	useEffect(() => {
		let unsubscribe;

		if (postId) {
			db.collection("posts")
				.doc(postId)
				.collection("comments")
				.orderBy("timestamp", "desc")
				.onSnapshot((snapshot) => {
					setComments(snapshot.docs.map((doc) => doc.data()));
				});
		}

		return () => {
			unsubscribe();
		}
	}, [postId]);

	const addComment = (e) => {
		e.preventDefault();

		db.collection("posts").doc(postId).collection("comments").add({
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			text: comment,
			username: userLoggedin.displayName,
		});
		setComment("");
	};

	return (
		<div className="post">
			{/*avatar and username*/}
			<div className="post__header">
				<Avatar className="post__avatar" src={avatar} />
				<h3>{username}</h3>
			</div>

			{/*image*/}
			<img className="post__image" src={imageUrl} alt="" />
			{/*caption*/}
			<h5 className="post__text">
				<strong>{username} </strong>
				{caption}
			</h5>
				
			<div className="comment__section">
				{
					comments.map((comment) => (
						<p><strong>{comment.username}</strong>{comment.text}</p>
					))
				}
			</div>

			{/*comments*/}
			{
				userLoggedin && (
				<form className="comment__input" onSubmit={addComment}>
					<input
						type="text"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Add comment..."
					/>
					<button disabled={!comment}>Submit</button>
				</form>

				)
			}
		</div>
	);
};
export default Post;
