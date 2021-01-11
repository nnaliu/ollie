import React, { useState, useEffect, useContext, createContext } from 'react';
import firebase, { firestore } from './firebase';
import 'firebase/auth';

const authContext = createContext();
const provider = new firebase.auth.GoogleAuthProvider();

// Wraps app and makes auth object
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object and render when it changes
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  
  // Wrap Firebase methods
  const signin = (email, password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signup = (email, password) => {
    return firebase
      .auth().createUserWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signInWithGoogle = () => {
    return firebase.auth().signInWithPopup(provider);
  };

  const signout = () => {
    return firebase
      .auth().signOut()
      .then(() => {
        setUser(false);
      });
  };

  const sendPasswordResetEmail = (email) => {
    return firebase
      .auth().sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (code, password) => {
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true;
      });
  };

  // Subscribe to user on mount
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  // Return the user object and auth methods
  return {
    user,
    signin,
    signup,
    signout,
    signInWithGoogle,
    sendPasswordResetEmail,
    confirmPasswordReset
  };
}

// Creates user in database
export const generateUserDoc = async (user, additionalData) => {
	if (!user) return;
	const userRef = firestore.doc(`users/${user.uid}`);
	const snapshot = await userRef.get();
	if (!snapshot.exists) {
		const {email, displayName} = user;
		try {
			await userRef.set({
				displayName,
				email,
        language: 'Spanish',
				...additionalData
			});
		} catch (err) {
			console.error('Error creating user document', err);
		}
	}
	return getUserDoc(user.uid);
};

export const updateUserDoc = async (uid, data) => {
  if (!uid) return;
  try {
    const res = await firestore.doc(`users/${uid}`).update(data);
    return res;
  } catch (err) {
    console.error('Error updating user', err);
    return err;
  }
};

export const getUserDoc = async (uid) => {
	if (!uid) return null;
	try {
		const userDoc = await firestore.doc(`users/${uid}`).get();
		return {
			uid,
			...userDoc.data()
		};
	} catch (err) {
		console.error('Error fetching user', err);
	}
  return null;
};