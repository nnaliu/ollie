import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserAlt, FaLock, FaAt } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useAuth, generateUserDoc } from './use-auth';
import './App.css';

function SignUp() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);
  
  const createUserHandler = async (event, email, password) => {
    event.preventDefault();
    try {
      const {user} = await auth.signup(email, password);
      generateUserDoc(user, {displayName});
    } catch (err) {
      setError('Error signing up with email and password');
    }
    setEmail('');
    setPassword('');
    setDisplayName('');
  }

  const onChangeHandler = (event) => {
    const {name, value} = event.currentTarget;
    if (name === 'userEmail') {
      setEmail(value);
    } else if (name === 'userPassword') {
      setPassword(value);
    } else if (name === 'displayName') {
      setDisplayName(value);
    }
  }

  return (
    <div>
      <div className='body-container'>
        <form className='input-form'>
          <div className='user-input'>
            <FaUserAlt className='icon' />
            <input
              type='text'
              name='displayName'
              value={displayName}
              placeholder='Name'
              id='displayName'
              onChange = {(event) => onChangeHandler(event)}
            />
          </div>
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
          </div>
          <button className='yellow-button' onClick={(event) => createUserHandler(event, email, password)}>Sign Up</button>
        </form>

        <div className='error'>{error}</div>
        <div>
          <span>Already have an account?   </span>
          <Link to='/'>Login here</Link>
        </div>
        <button className='google' onClick={() => auth.signInWithGoogle()}><FcGoogle /> Sign in with Google</button>
      </div>
    </div>
  )
}

export default SignUp;