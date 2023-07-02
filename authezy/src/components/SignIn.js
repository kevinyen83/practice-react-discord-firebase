import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "/Users/net/authezy/src/firebase.js";
import logo from '/Users/net/authezy/src/assets/discord-icon.png'


const SignIn = () => {
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");

    // const signIn = (e) => {
    //     e.preventDefault();
    //     signInWithEmailAndPassword(auth, email, password)
    //     .then((userCredential) => {
    //         console.log(userCredential);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
    // };

    const loginInWithDiscord = () => {
        window.location.href = "https://us-central1-authezy-1fe38.cloudfunctions.net/api/login";
    };


    return (
    <div className="sign-in-container">
        <button className="login-button" onClick={loginInWithDiscord}>
            <span>
                <img className="login-button-icon" src={logo}/>
            </span>
            <span className="login-button-text">Login with Discord</span>
        </button>

      {/* <form onSubmit={signIn}>
        <h1>Log In to your Account</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type="submit">Log In</button>
      </form> */}
    </div>
  );
};

export default SignIn;