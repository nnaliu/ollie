import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/analytics';
import {firebaseConfig} from './firebase-config';

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
export const analytics = firebase.analytics();
export const functions = firebase.functions();

export default firebase;