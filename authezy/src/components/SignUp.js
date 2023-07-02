// import React, { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../firebase.js";

// const SignUp = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const userCollectionRef = collection(db, "users");

//   const createUsers = async () => {
//     await addDoc(userCollectionRef, { email: email, password: password });
//     console.log(email)
//   };

//   return (
//     <div className="sign-in-container">
//       <h1>Create Account</h1>
//       <input
//         type="email"
//         placeholder="Enter your email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Enter your password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button type="submit" onClick={createUsers}>
//         Sign Up
//       </button>
//     </div>
//   );
// };

// export default SignUp;
