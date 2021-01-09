import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import * as diff from 'diff';
import './App.css';
import { IoSend, IoCloudUpload } from "react-icons/io5";

// import { analytics, auth, firestore, functions } from './firebase'
import firebase, { analytics, firestore, functions } from './firebase'

const gpt3Chat = functions.httpsCallable('gpt3Gateway');
const grammarCheck = functions.httpsCallable('grammarCheckGateway');
const translate = functions.httpsCallable('translateGateway');

function ChatRoom() {

  const dummy = useRef(); // used for scrolling
  const data = useLocation();
  const uuid = uuidv4();

  // Each conversation item has the following fields: text, createdAt, humanOrBot, sessionId
  const [conversation, setConversation] = useState([]);
  const messagesRef = firestore.collection('messages'); // For storing messages in Firebase
  const [formValue, setFormValue] = useState('');

  // Ollie sends first message
  useEffect(() => {
    callOllie({prompt: data.state.prompt, conversation: conversation});
  }, []);

  // Called whenever conversation changes
  useEffect(() => {
    if (conversation && conversation.length && conversation[conversation.length - 1].humanOrBot === 0) {
      callOllie({prompt: data.state.prompt, conversation: conversation});
    }
  }, [conversation]);

  const saveChat = () => {
    console.log("Save Chat Called");
    console.log(conversation);
    for (var i = 0; i < conversation.length; i++) {
      const msg = conversation[i];

      if (msg.humanOrBot) { // bot 
        messagesRef.add({
          text: msg.text,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          humanOrBot: 1,
          sessionId: uuid
        });
      } else { // human
        messagesRef.add({
          text: msg.text,
          diff: msg.diff,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          humanOrBot: 0,
          sessionId: uuid
        });
      }
    }
    setConversation([{humanOrBot: 1, text: ''}]);
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log(formValue);
    setFormValue('');
    var translation = formValue;
    var diff = [];

    // Translation
    [translation, diff] = await findForeignWords(formValue);

    // Fix Grammar
    const matches = await grammarCheck({ text: translation });
    if (matches && matches.data.length > 0) {
      [translation, diff] = await fixGrammar(translation, diff, matches);
    }

    // Store output
    await storeUserMessage(translation, diff);
  }

  const findForeignWords = async (text) => {
    const translation = await translate({ text: text, language: 'Spanish' });
    var d = diff.diffWords(text, translation.data);
    d = d.map(part => {
      return {value: part.value, change: part.added ? 1 : part.removed ? -1 : 0};
    });
    return [translation.data, d];
  }

  const fixGrammar = (text, diff, matches) => {
    var correctText = '';
    var new_diff = [];

    if (diff && diff.length) {
      diff.forEach((part) => {
        matches.data.forEach((match) => {
          if (text.substring(match.offset, match.offset + match.length) === part.value) {
            new_diff.push({ value: match.replacements[0].value, change: 1 });
          }
        });
      });
    } else {
      var index = text.length;
      for (var i = matches.data.length - 1; i >= 0; i--) {
        const match = matches.data[i];
        new_diff.unshift({ value: text.substring(match.offset + match.length, index), change: 0});
        new_diff.unshift({ value: match.replacements[0].value, change: 1});
        new_diff.unshift({ value: text.substring(match.offset, match.offset + match.length), change: -1});
        index = match.offset;
      }
      new_diff.unshift({ value: text.substring(0, index), change: 0});
    }
    
    // Form correct text
    correctText = new_diff.map((part) => {
      if (part.change === 1 || part.change === 0) {
        return part.value;
      }
      return '';
    }).join(' ');

    return [correctText, new_diff];
  }

  const storeUserMessage = (correctInput, diff) => {
    setConversation(conversation => [...conversation, {
      text: correctInput,
      diff: diff,
      humanOrBot: 0 // human
    }]);
  }

  const transformConvo = (conversation) => {
    var conversation_index = conversation.length >= 6 ? conversation.length - 6 : 0;
    var conversation_last6 = conversation.slice(conversation_index);
    var output = [];

    for (var i = 0; i < conversation_last6.length; i++) {
      if (conversation_last6[i].humanOrBot) {
        output.push('Ollie: ' + conversation_last6[i].text);
      } else {
        output.push('User: ' + conversation_last6[i].text)
      }
    }
    output.push('Ollie:');
    return output;
  }

  const callOllie = (userInput) => {
    console.log("CALL OLLIE");
    gpt3Chat({ prompt: userInput.prompt, conversation: transformConvo(userInput.conversation) })
      .then((result) => {
        const response = result.data.text;
        // if (result.data.text == "") { result.data.text = "Yikes, I was daydreaming! Could you repeat?"}
        setConversation(conversation => [...conversation, {
          text: response,
          humanOrBot: 1
        }]);
      })
      .catch((error) => {
        console.log("Unable to call Ollie. " + error);
      });
  }

  const scrollToBottom = () => {
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }

  useEffect(scrollToBottom, [conversation]);

  return (
    <div className='ChatRoom'>
      <div className='body-container'>
        {conversation && [...conversation].map(msg => <ChatMessage key={uuidv4()} message={msg} />)}
        <div ref={dummy}></div>
      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} placeholder='Message Ollie...' onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit"><IoSend className='icon'/></button>
      </form>
      <div>
        <button className='SaveButton' onClick={() => saveChat()}><IoCloudUpload className='icon' /></button>
      </div>
    </div>
  )
}

function ChatMessage(props) {
  const {text, diff, humanOrBot} = props.message;
  const messageClass = humanOrBot === 0 ? 'sent' : 'received';
  var incorrectHTML = '';
  var correctHTML = '';

  if (diff && !diff.every(part => part.change === 0)) {
    diff.forEach((part) => {
      switch (part.change) {
        case 1:
          correctHTML = correctHTML + '<span style="color:lightgreen;">' + part.value + '</span>';
          break;
        case -1:
          incorrectHTML = incorrectHTML + '<span style="color:red;">' + part.value + '</span>';
          break;
        default:
          correctHTML = correctHTML + part.value;
          incorrectHTML = incorrectHTML + part.value;
      }
    });

    return (
      <div className={`message ${messageClass}`} dangerouslySetInnerHTML={{__html: '<p>' + incorrectHTML + '</br>'
       + correctHTML + '</p>'}}>
      </div>
    )
  }
  else {
    return (
      <div className={`message ${messageClass}`}>
        <p>{text}</p>
      </div>
    )
  }
}

export default ChatRoom;