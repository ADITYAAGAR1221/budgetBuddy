import React, { useState } from "react";
import "./SingupSignin.css";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
 } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function SignupSigninComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  

  function signupWithEmail(){
    setLoading(true);
    console.log("clicked");
    console.log("Name", name);
    console.log("email", email);
    console.log("password", password);
    console.log("confirmpassword", confirmPassword);

    if(name !== "" && email !== "" && password !== "" && confirmPassword !== ""){
        if(password == confirmPassword){
            // code from firebase
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log("User>>>", user);
                toast.success("User Created!");
                setLoading(false);
                setName("");
                setPassword("");
                setEmail("");
                setConfirmPassword("");
                createDoc(user); 
                navigate("/dashboard");
                // Create A doc with user id as the following id
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage);
                setLoading(false);
            });
        }
        else{
            toast.error("Password and Confirm Password don't match!");
            setLoading(false);
        }
    } 
    else{
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  function LoginUsingEmail(){
    console.log("Email", email);
    console.log("password",password);
    setLoading(true);
    if(email !== "" && password !== ""){
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          toast.success("User Logged In!");
          console.log("User Loggin in",user);
          setLoading(false);
          navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage);
        });
    }
    else{
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }
  async function createDoc(user) {
    setLoading(true);
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid); // Changed to user.uid
      const userData = await getDoc(userRef);
  
      if (!userData.exists()) {
        await setDoc(userRef, {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc created!");
      } else {
        // toast.error("Doc already exists");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }
  

  function googleAuth(){  
    setLoading(true);
    try{
      signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("user>>>", user);
        createDoc(user);
        setLoading(false);
        navigate("/dashboard");
        toast.success("User authenticated!");
        // IdP data available using getAdditionalUserInfo(result)
      }).catch((error) => {
        // Handle Errors here.
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
    }
    catch(e){
      setLoading(false);
      toast.error(e.message);
    }
  }

  return (
    <>
    {loginForm ? ( 
    <div className="signup-wrapper">
      <h2 className="title">
        Login on <span style={{ color: "var(--theme)" }}>Budgetbuddy. </span>
      </h2>
      <form>
        <Input
          type="email"
          label={"Email"}
          state={email}
          setState={setEmail}
          placeholder={"peter@gmail.com"}
        />
        <Input
          type="password"
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder={"Example@123"}
        />
        <Button
          disabled = {loading}
          text={loading ? "Loading..." : "Login Using Email and Password"}
          onClick={LoginUsingEmail}
        />
        <p className="p-login">or</p>
        <Button
          onClick={googleAuth}
          text={loading ? "Loading..." : "Login Using Google"}
          blue={true}
          // onClick={() => console.log("Google Signup")} // Example of using the Google button
        />
        <p className="p-login" 
           style={{cursor:"pointer"}} 
           onClick={() => setLoginForm(!loginForm)}>
           Or Don't Have An Account? Click Here 
        </p>
      </form>
    </div>
    ) : (
    <div className="signup-wrapper">
        <h2 className="title">
          Sign Up on <span style={{ color: "var(--theme)" }}>Budgetbuddy. </span>
        </h2>
        <form>
          <Input
            label={"Full Name"}
            state={name}
            setState={setName}
            placeholder={"Peter"}
          />
          <Input
            type="email"
            label={"Email"}
            state={email}
            setState={setEmail}
            placeholder={"peter@gmail.com"}
          />
          <Input
            type="password"
            label={"Password"}
            state={password}
            setState={setPassword}
            placeholder={"Example@123"}
          />
          <Input
            type="password"
            label={"Confirm Password"}
            state={confirmPassword}
            setState={setConfirmPassword}
            placeholder={"Example@123"}
          />
  
          {/* Use Button Component for signupWithEmail */}
          <Button
            disabled = {loading}
            text={loading ? "Loading..." : "Signup Using Email and Password"}
            onClick={signupWithEmail}
          />
          <p className="p-login">or</p>
          <Button
            onClick={googleAuth}
            text={loading ? "Loading..." : "Signup Using Google"}
            blue={true}
          />
          <p className="p-login" 
           style={{cursor:"pointer"}} 
           onClick={() => setLoginForm(!loginForm)}>
            Or Have An Account? Click Here 
          </p>
        </form>
      </div>
    )}
   </> 
  );
}

export default SignupSigninComponent;
