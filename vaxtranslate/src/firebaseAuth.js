/**
 * File: firebaseAuth.js
 * Description: This file contains functions that handle user registration
 *              and login using Firebase Authentication and Firestore.
 *
 * Exports:
 *  - registerUsers: Creates a new user in Firebase Authentication, stores additional
 *                   user data in Firestore, then returns the user credential.
 *  - loginUser:     Logs in an existing user using Firebase Authentication,
 *                   then returns the user credential.
 *
 */

import { auth, db } from "./firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

/**
 * Registers a new user in Firebase Authentication and stores
 * their details in Firestore.
 *
 * @async
 * @function registerUsers
 * @param {string} email - The user's email address.
 * @param {string} password - The user's chosen password.
 * @param {string} username - The user's display name or chosen username.
 * @returns {Promise<import("firebase/auth").UserCredential>}
 *          A promise that resolves to the user credential object,
 *          which contains data about the newly created user.
 * @throws {Error} If the user could not be created or if Firestore update fails.
 */
export const registerUsers = async(email, password, fullName)=>{
    
    let user;
    try{
        const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
        user = userCredential.user;
        console.log(`user email: ${user.email}, username: ${fullName}`);

        await setDoc(doc(db,"users",user.uid),{
            userid:user.uid,
            name:fullName,
            email:user.email,
            
        })
        
        console.log(`${fullName} saved to firestore`);

    }catch(error){
        console.error("error object: ", error);
        if(error.code === "auth/email-already-in-use"){
            throw new Error(`${email} is already registered, please sign into your account.`);
        }else if(error.code === "auth/weak-password"){
            throw new Error("password is too weak, password needs to be at least 6 characters long!");
        }else{
            throw error;
        }
    }
    return user;
}

/**
 * Logs in an existing user using Firebase Authentication.
 *
 * @async
 * @function loginUser
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<import("firebase/auth").User>}
 *          A promise that resolves to the user object upon successful login.
 * @throws {Error} If the login fails (e.g., wrong password or nonexistent user).
 */
export const loginUser = async(email, password) =>{
    try{    
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log(email, password)
        console.log(`user login: ${userCredential.user.email}`);
        return userCredential.user;
    }catch(error){
        console.error("Login error")
        throw error;
    }
}