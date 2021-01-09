import React, { Fragment } from 'react';
import { Route, Link, Switch, useLocation, useHistory } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from './use-auth';
import './App.css';

export function Back(props) {
  const history = useHistory();
  return (
    <button className={props.className} onClick={() => history.goBack()}>Back</button>
  )
}

export function SignOut(props) {
  const auth = useAuth();
  const history = useHistory();
  return auth.user && (
    <Link className={props.className} to='/'>
      <button className='sign-out' onClick={() => auth.signout(() => history.push('/'))}>Sign Out</button>
    </Link>
  )
}

function Header() {
  const auth = useAuth();
  const data = useLocation();

  return (
    <header>
      {auth.user ? (
        <Fragment>
        	<Switch>
        		<Route exact path='/home'><div className='header-child'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></Route>
        		<Route><Back className='header-child' /></Route>
          </Switch>

          <Switch>
            <Route exact path='/home'>
              <h1 className='header-child'>Learn with Ollie</h1>
            </Route>
            <Route path='/chat'>
              <h1 className='header-child'>{data.state ? data.state.type: 'Chat with Ollie'}</h1>
            </Route>
            <Route>
              <h1 className='header-child'>404 Error</h1>
            </Route>
          </Switch>

          <Switch>
            <Route><SignOut className='header-child'/></Route>
          </Switch>

        </Fragment>
      ) : (
        <Fragment>
          <Switch>
            <Route path='/signup'>
              <Link to='/' className='header-child'><FaTimes /></Link>
            </Route>
            <Route path='/forgotpassword'>
              <Link to='/' className='header-child'><FaTimes /></Link>
            </Route>
            <Route><div className='header-child'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></Route>
          </Switch>

          <Switch>
            <Route exact path='/'><h1 className='header-child'>Login</h1></Route>
            <Route path='/signup'><h1 className='header-child'>Sign Up</h1></Route>
            <Route path='/signup'><h1 className='header-child'>Reset password</h1></Route>
          </Switch>
          
          <Switch>
            <Route exact path='/'><Link to='/signup' className='header-child'>Sign Up</Link></Route>
            <Route path='/signup'><Link to='/' className='header-child'>Login</Link></Route>
            <Route><div className='header-child'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></Route>
          </Switch>
        </Fragment>
      )}
    </header>
  )
}

export default Header;