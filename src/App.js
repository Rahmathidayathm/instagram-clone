import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import { db, auth } from "./firebase";
import { Modal, Button, Input } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import "./App.css";

import Post from "./Post";
import ImageUpload from './ImageUpload';

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    btn: {
      margin: "20px",
    },
  })
);

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  // Sign up
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [username, user]);

  useEffect(() => {
    db.collection("posts").onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });

        setOpen(false);
      })
      .catch((error) => alert(error.message));
  };

  const handleSignIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((authUser) => {
        setUser(authUser);
        setOpenSignIn(false);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <p id="server-modal-description">
            <form className="app__signup" onSubmit={handleSubmit}>
              <center>
                <img
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
                />
              </center>
              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" color="success" variant="contained">
                Sign up
              </Button>
            </form>
          </p>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <p id="server-modal-description">
            <form className="app__signup" onSubmit={handleSignIn}>
              <center>
                <img
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt=""
                />
              </center>
              <Input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" color="success" variant="contained">
                Sign in
              </Button>
            </form>
          </p>
        </div>
      </Modal>
      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
      {user ? (
        <Button
          className={classes.btn}
          variant="contained"
          color="primary"
          onClick={() => auth.signOut()}
        >
          Logout
        </Button>
      ) : (
        <div className="auth__btn">
          <Button
            className={classes.btn}
            onClick={() => setOpen(true)}
          >
            Sign Up
          </Button>
          <Button
            className={classes.btn}
            onClick={() => setOpenSignIn(true)}
          >
            Sign In
          </Button>
        </div>
      )}
      </div>
      {/*post*/}
      {posts.map(({ id, post }) => (
        <Post
          userLoggedin={user}
          key={id}
          postId={id}
          username={post.username}
          avatar="https://source.unsplash.com/50x50"
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}

      {
        user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h4>Sorry, you need login for upload post</h4>
        )
      }

      {/*posts*/}
    </div>
  );
}

export default App;
