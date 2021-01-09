import React, { useState } from 'react';
import { Route, Link, Switch, withRouter, useLocation, useHistory } from 'react-router-dom';
import { FaAt } from 'react-icons/fa';
import './App.css';

import { useAuth } from './use-auth';

function PasswordReset() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [error, setError] = useState(null);
  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === 'userEmail') {
      setEmail(value);
    }
  };
  
  const sendResetEmail = (event) => {
    event.preventDefault();
    auth.sendPasswordResetEmail(email)
      .then(() => {
        setEmailHasBeenSent(true);
        setTimeout(() => {setEmailHasBeenSent(false)}, 3000);
      })
      .catch(() => {
        setError('Error resetting password');
      })
  };

  return (
    <div>
      <div className='body-container'>
        <form action='' className='input-form'>
          {emailHasBeenSent && (
            <div>
              An email's waiting in your inbox!
            </div>
          )}
          {error !== null && (
            <div>{error}</div>
          )}
          <div className='user-input'>
            <FaAt className='icon' />
            <input
              type='email'
              name='userEmail'
              value={email}
              placeholder='Email'
              id='userEmail'
              onChange={onChangeHandler}
            />
          </div>
          <button className='yellow-button'>Send reset link</button>
        </form>
      </div>
    </div>
  )
}

export default PasswordReset;