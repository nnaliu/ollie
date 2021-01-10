import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import farfromhome from './assets/farfromhome.jpg';

import ChatRoom from './ChatRoom';
import Header from './Header';
import PasswordReset from './PasswordReset';
import PrivateRoute from './PrivateRoute';
import ProfilePage from './ProfilePage';
import SelectionScreen from './SelectionScreen';
import SignUp from './SignUp';
import SignIn from './SignIn';

// import firebase, { analytics, firestore, functions } from './firebase';
import { ProvideAuth } from './use-auth';

import './App.css';

function App() {
  return (
    <ProvideAuth>
      <div className='App'>
        <Header />
        <Switch>
          <Route path='/login'> <SignIn /> </Route>
          <Route path='/signup'> <SignUp /> </Route>
          <Route path='/forgotpassword'> <PasswordReset /> </Route>
          <PrivateRoute exact path='/'> <SelectionScreen /> </PrivateRoute>
          <PrivateRoute path='/profile'> <ProfilePage /> </PrivateRoute>
          <PrivateRoute path='/chat'> <ChatRoom /> </PrivateRoute>
          <PrivateRoute path='/home'> <SelectionScreen /> </PrivateRoute>
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
