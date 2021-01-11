import React from 'react';
import { Route, Link, Switch, useLocation, useHistory } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { useAuth } from './use-auth';
import { FaTimes } from 'react-icons/fa';
import './App.css';

export function Back(props) {
  const history = useHistory();
  return (
    <button className={props.className} onClick={() => history.goBack()}>Back</button>
  );
}

export function SignOut(props) {
  const auth = useAuth();
  const history = useHistory();
  return auth.user && (
    <Link className={props.className} to='/login'>
      <button className='sign-out' onClick={() => auth.signout(() => history.push('/'))}>Sign Out</button>
    </Link>
  );
}

function Header(props) {
  const data = useLocation();

  return (
    <header>

      {/* Left Button*/}
      <Switch>
        <Route path='/login'><div className='header-child'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></Route>
        <Route path='/signup'>
          <Link to='/login' className='header-child'><FaTimes /></Link>
        </Route>
        <Route path='/forgotpassword'>
          <Link to='/login' className='header-child'><FaTimes /></Link>
        </Route>
        <PrivateRoute exact path='/chat'><Back className='header-child' /></PrivateRoute>
        <PrivateRoute path='/profile'><Back className='header-child' /></PrivateRoute>
        <PrivateRoute><SignOut className='header-child'/></PrivateRoute>
        <Route><div className='header-child'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></Route>
      </Switch>

      {/* Middle Text */}
      <Switch>
        <Route path='/login'><h1 className='header-child'>Login</h1></Route>
        <Route path='/signup'><h1 className='header-child'>Sign Up</h1></Route>
        <Route path='/forgotpassword'><h1 className='header-child'>Reset password</h1></Route>
        <Route exact path='/'>
          <h1 className='header-child'>Learn with Ollie</h1>
        </Route>
        <PrivateRoute exact path='/'>
          <h1 className='header-child'>Learn with Ollie</h1>
        </PrivateRoute>
        <PrivateRoute path='/chat'>
          <h1 className='header-child'>{data.state ? data.state.type: 'Chat with Ollie'}</h1>
        </PrivateRoute>
        <PrivateRoute path='/profile'>
          <h1 className='header-child'>Profile</h1>
        </PrivateRoute>
        <PrivateRoute path='/home'>
          <h1 className='header-child'>Learn with Ollie</h1>
        </PrivateRoute>
        <PrivateRoute>
          <h1 className='header-child'>404 Error</h1>
        </PrivateRoute>
        <Route>
          <h1 className='header-child'>404 Error</h1>
        </Route>
      </Switch>

      {/* Right Button*/}
      <Switch>
        <Route exact path='/login'><Link to='/signup' className='header-child'>Sign Up</Link></Route>
        <Route path='/signup'><Link to='/login' className='header-child'>Login</Link></Route>
        <PrivateRoute path='/profile'><div className='header-child'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></PrivateRoute>
        <PrivateRoute path='/chat'><button className='header-child' onClick={() => props.save()}>Save & Clear Chat</button></PrivateRoute>
        <PrivateRoute>
          <Link to='/profile' className='header-child'>Profile</Link>
        </PrivateRoute>
        <Route><div className='header-child'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></Route>
      </Switch>
    </header>
  );
}

export default Header;