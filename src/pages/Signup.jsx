import React from 'react'
import Header from '../components/Header/Header';
import SignupSigninComponent from '../components/SingupSignin/SingupSignin';

function Signup() {
  return(
     <div>
        <Header/>
        <div className="wrapper">
          <SignupSigninComponent/>
        </div>
    </div>
  );
}


export default Signup;
