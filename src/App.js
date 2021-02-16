import React, { useRef, useState  , useEffect} from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  // your config
 
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {
  
  const [user] = useAuthState(auth);
  const scrollref = useRef();
  
  return (
    <div className="App">
      <header>
        <h1>LetsTalk</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn /> }
        <span ref={scrollref}></span>
      </section>


    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
     
    </div>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef(); //To track message
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt');
  const scrollref = useRef();
  
  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  
  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>
      
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      

      <span ref={dummy}></span>

    </main>
    
    <form onSubmit={sendMessage}>
    
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>Send</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const scrollref = useRef();
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
  useEffect(() => {
    scrollref.current.scrollIntoView({ behavior: 'smooth' });
  });
  
  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
    <span ref={scrollref}></span>
  </>)
}


export default App;
