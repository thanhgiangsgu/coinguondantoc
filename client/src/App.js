import logo from './logo.svg';
import './App.css';
import Welcome from './component/Welcome';
import Ready from './component/Ready';
import Loading from './component/Loading';
import ShowQuestion from './component/ShowQuestion';

import { toast, Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs';
import './fonts.css'

var stompClient = null;

function App() {
  const [teamName, setTeamName] = useState('');
  const [step, setStep] = useState('welcome')
  const [phase, setPhase] = useState(0);
  const [message, setMessage] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState({});
  const [isBell, setIsBell] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
      setShowConfirmation(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleConfirmReload = () => {
    setShowConfirmation(false);
    localStorage.clear(); // Or remove specific keys as needed
    window.location.reload();
  };

  const handleCancelReload = () => {
    setShowConfirmation(false);
  };

  useEffect(() => {
    var socket = new SockJS('http://14.225.192.174:8111/gs-guide-websocket');
    const stompClient = Stomp.over(socket)
    stompClient.connect({}, function () {
      setStompClient(stompClient)
    })
  }, [])
  function sendAnswerToServer(answer) {
    const headers = {};
    const body = JSON.stringify({ teamCode: teamCode, answer: answer })
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

      if (jsonObject.cmd == "STOP_ANSWERING") {
        setPhase(0)
        setStep('loading')
        setTimeout(() => {
          setStep('ready');
        }, 2000);

      }
      if (jsonObject.cmd == "BELL_OPEN") {
        setIsBell(true);
      }
      if (jsonObject.cmd == "BELL_STOP") {
        setIsBell(false);
      }

      if (jsonObject.cmd == "TEAM_SCORE") {
        setPhase(0)
        setScore(jsonObject.data.score)
        if (jsonObject.data.newScore == 0) {
          toast.error(`Chia buồn ${jsonObject.data.name} chưa ghi được điểm`,
            {
              duration: 3000,
              style: {
                width: '500px',
                height: '100px',
              },
              position: 'top-right'
            })
        } else {
          toast.success(`Chúc mừng ${jsonObject.data.name} vừa ghi được ${jsonObject.data.newScore}`,
            {
              duration: 3000,
              style: {
                width: '500px',
                height: '100px',
              },
              position: 'top-right'
            })
        }
        setStep('ready')

      }

    })
    stompClient.send('/app/sub', headers, body);
  }

  const handleRingBell = () => {
    const headers = {};
    const body = JSON.stringify({ teamCode: teamCode })
    stompClient.subscribe(`/topic/${teamCode}`, function (greeting) {
      const jsonObject = JSON.parse(greeting.body);
    if (jsonObject.cmd == "BELL_OPEN"){
      setIsBell(true);
    }
    if (jsonObject.cmd == "BELL_CLOSE"){
      setIsBell(false);
    }
    })
    stompClient.send('/app/bell', headers, body);
  }

  return (
    <div>
      {/* <div>
        {showConfirmation && (
          <div>
            <p>Are you sure you want to reload?</p>
            <button onClick={handleConfirmReload}>Confirm</button>
            <button onClick={handleCancelReload}>Cancel</button>
          </div>
        )}
      </div> */}
      {teamCode ? (
        step === 'ready' ? (
          <Ready
            stompClient={stompClient}
            teamName={teamName}
            score={score}
            phase={phase}
            message={message}
            handleRingBell={handleRingBell}
            isBell={isBell}
          />
        ) : step === 'loading' ? (
          <Loading />
        ) : step === 'showQuestion' ? (
          <ShowQuestion
            sendAnswerToServer={sendAnswerToServer}
            question={question}
          />
        ) : null // Or some default component if step is not recognized
      ) : (
        <Welcome
          sendDataToServer={sendDataToServer}
          setStep={setStep}
          setTeamCode={setTeamCode}
        />
      )}
    </div>
  );
}

export default App; 
