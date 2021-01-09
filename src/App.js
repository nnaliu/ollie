import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import farfromhome from './assets/farfromhome.jpg';

import ChatRoom from './ChatRoom';
import Header from './Header';
import PasswordReset from './PasswordReset';
import ProfilePage from './ProfilePage';
import SelectionScreen from './SelectionScreen';
import SignUp from './SignUp';
import SignIn from './SignIn';

import firebase, { analytics, firestore, functions } from './firebase';
import { ProvideAuth } from './use-auth';

import './App.css';

function App() {
  return (
    <ProvideAuth>
      <div className='App'>
        <Header />
        <Switch>
          <Route exact path='/' component={SignIn} />
          <Route path='/chat' component={withRouter(ChatRoom)} />
          <Route path='/home' component={SelectionScreen} />
          <Route path='/signup' component={SignUp} />
          <Route path='/forgotpassword' component={PasswordReset} />
          <Route component={PageNotFound} />
        </Switch>
      </div>
    </ProvideAuth>
  )
}

function PageNotFound() {
  return (
    <div className='PageNotFound body-container'>
      <h4>Oops, you wandered too far from home.</h4>
      <img alt="You've wandered too far from home" src={farfromhome} />
    </div>
  )
}

export default App;
