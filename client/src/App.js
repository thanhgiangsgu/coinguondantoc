import logo from './logo.svg';
import './App.css';
import Welcome from './component/Welcome';
import Ready from './component/Ready';
import Loading from './component/Loading';
import ShowQuestion from './component/ShowQuestion';

import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs';

var stompClient = null;

function App() {
  const [teamName, setTeamName] = useState('');
  const [entered, setEntered] = useState(false);
  const [step, setStep] = useState('welcome')
  const [phase, setPhase] = useState(0);
  const [message, setMessage] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [answer, setAnswer] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [score, setScore] = useState(0);
  const [question , setQuestion] = useState({});

  useEffect(() => {
    var socket = new SockJS('http://14.225.192.174:8111/gs-guide-websocket');
    const stompClient = Stomp.over(socket)
    stompClient.connect({}, function () {
      setStompClient(stompClient)
    })
  }, [])
  function sendAnswerToServer(answer){
    const headers  = {};
    const body = JSON.stringify({ teamCode: teamCode, answer: answer})
    stompClient.subscribe(`/topic/${teamCode}`, function (greeting) {
        const jsonObject = JSON.parse(greeting.body);
        
      })
    stompClient.send('/app/answer', headers, body);
    setStep('loading')
  }

  function sendDataToServer(teamCode) {
    setTeamCode(teamCode)
    const headers = {}
    const body = JSON.stringify({ teamCode })
    stompClient.subscribe(`/topic/${teamCode}`, function (greeting) {
      const jsonObject = JSON.parse(greeting.body);
      if (jsonObject.cmd == "TEAM_CONNECTED") {
        setTeamName(jsonObject.data.name)
        setScore(jsonObject.data.score);
        setStep('loading');
        setTimeout(() => {
          setStep('ready');
        }, 2000);
      }
      if (jsonObject.cmd == "START_PHASE") {
        if (jsonObject.data.phaseNumber == 1) {
          setPhase(1);
          setStep('loading');
          setTimeout(() => {
            setStep('ready');
          }, 2000);
        } else {
          setPhase(2);
          setStep('loading');
          setTimeout(() => {
            setStep('ready');
          }, 2000);
        }
      }
      if (jsonObject.cmd == "START_COURSE") {
        setMessage(jsonObject.data.message)
        setStep('loading');
        setTimeout(() => {
          setStep('ready');
        }, 500);
      }
      if (jsonObject.cmd == "START_QUESTION") {
        setQuestion(jsonObject.data)
        setStep('loading');
        setTimeout(() => {
          setStep('showQuestion');
        }, 500);
      }

      if (jsonObject.cmd == "STOP_ANSWERING"){
        setPhase(0)
        setStep('loading')
        setTimeout(() => {
          setStep('ready');
        }, 2000);

      }
      if (jsonObject.cmd == "TEAM_SCORE"){
        setPhase(0)
        setScore(jsonObject.data.score)
        setStep('ready')
        
      }

    })
    stompClient.send('/app/sub', headers, body);
  }

  return (
    <div>
      {step == 'ready' ? (
        <Ready
          stompClient={stompClient}
          teamName={teamName}
          score={score}
          phase={phase}
          message={message}
        />
      ) : step == 'loading' ? (
        <Loading />
      ) : step == 'welcome' ?
        (
          <Welcome
            sendDataToServer={sendDataToServer}
            setStep={setStep}
            setTeamCode={setTeamCode}
          />
        ) : (
          <ShowQuestion sendAnswerToServer={sendAnswerToServer} question={question}/>
        )}
    </div>
  );
}

export default App; 
