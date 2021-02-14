import logo from './logo.svg';
import React from 'react'
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'

import { userAuthState } from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  //fb config
})



function App() {
  return ( <
    div className = "App" >
    <header className = "App-header">
    </header>
    <
    /div >
  );
}

export default App;