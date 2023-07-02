import React from 'react';
import SignIn from './SignIn.js';
// import SignUp from './SignUp.js';

const LoginPage = () => {

return (
    <div className='login-container'>
        <div className='login-container-item'>
            <h1>Welcome to DreamSlip</h1>
            <SignIn/>
            {/* <SignUp/> */}
        </div>
    </div>
);
};

export default LoginPage;