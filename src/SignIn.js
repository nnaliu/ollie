import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaUserAlt, FaLock, FaAt, FaTimes } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from './use-auth';
import './App.css';

function SignIn() {
  const auth = useAuth();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const signInHandler = async (event, email, password) => {
    event.preventDefault();
    try {
      await auth.signin(email, password);
      history.push('/home');
    } catch (err) {
      setError('Error signing in with email and password');
      console.error('Error signing in with email and password');
    }
  }

  const signInWithGoogleHandler = async () => {
    try {
      await auth.signInWithGoogle();
      history.push('/home');
    } catch (err) {
      setError('Error signing in with Google');
      console.error('Error signing in with Google');
    }
  }

  const onChangeHandler = (event) => {
    const {name, value} = event.currentTarget;
    if (name === 'userEmail') {
      setEmail(value);
    } else if (name === 'userPassword') {
      setPassword(value);
    }
  }

  return (
    <div>
      <div className='body-container'>
        <form className='input-form'>
          <div className='error'>{error}</div>
          <div className='user-input'>
            <FaAt className='icon' />
            <input
              type='email'
              name='userEmail'
              value={email}
              placeholder='Email'
              id='userEmail'
              onChange={(event) => onChangeHandler(event)}
            />
          </div>
          <div className='user-input'>
            <FaLock className='icon' />
            <input
              type='password'
              name='userPassword'
              value={password}
              placeholder='Password'
              id='userPassword'
              onChange={(event) => onChangeHandler(event)}
            />
            <Link className='forgotpassword' to='/forgotpassword'>Forgot Password?</Link>
          </div>
          <button className='yellow-button' onClick={(event) => signInHandler(event, email, password)}>Login</button>
        </form>

        <button className='google' onClick={() => signInWithGoogleHandler()}><FcGoogle /> Sign in with Google</button>
      </div>
    </div>
  )
}

export default SignIn;