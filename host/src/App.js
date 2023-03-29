import { useState, useEffect } from 'react';
import './App.css';
import Exam1 from './component/Exam1';
import Exam2 from './component/Exam2';
import Exam1Child from './component/Exam1Child';
import HomePage from './component/HomePage';
import Admin from './component/Admin';

import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs';

var stompClient = null;

function App() {



  const [step, setStep] = useState('admin')
  const [firstPhaseQuestions, setFirstPhaseQuestions] = useState({});
  const [secondPhaseQuestions, setSecondPhaseQuestions] = useState({})
  const [stompClient, setStompClient] = useState(null)
  const [teamList, setTeamList] = useState([])
  const [teamIdSelected, setTeamIdSelected] = useState(0);
  const competition = JSON.parse(localStorage.getItem('dataCompetition')) || {};
  const competitionName = competition.name || "";
  useEffect(() => {
    var socket = new SockJS('http://14.225.192.174:8111/gs-guide-websocket');
    const stompClient = Stomp.over(socket)
    stompClient.connect({}, function () {
      setStompClient(stompClient)
      stompClient.subscribe('/topic/host', function (message) {
        const jsonObject = JSON.parse(message.body);
        console.log(jsonObject);
        if (jsonObject.cmd == "TEAM_CONNECTED") {
          const newTeamList = [...teamList];
          newTeamList.push(jsonObject)
          setTeamList(newTeamList)
        }
        if (jsonObject.cmd == "TEAM_ANSWER") {
          localStorage.removeItem('listAnswer')
          localStorage.setItem('listAnswer', JSON.stringify(jsonObject.data));
        }
        // setListTeamData(prevListTeamData => [...prevListTeamData, teamCode]);
        // console.log(listTeamData);
      });
    })
  }, [teamList])

  return (
    <div>
      {step == 'exam1' ? (
        <Exam1
          competitionName={competitionName}
          teamList={teamList}
          firstPhaseQuestions={firstPhaseQuestions}
          setStep={setStep}
          setTeamIdSelected={setTeamIdSelected}
        />
      ) : step == 'exam1Child' ? (
        <Exam1Child
          competitionName={competitionName}
          setStep={setStep}
          teamIdSelected={teamIdSelected}
        //firstPhaseQuestions={firstPhaseQuestions}
        // secondPhaseImage={secondPhaseImage}
        />
      ) : step == 'homepage' ?
        (<HomePage
          competitionName={competitionName}
          setStep={setStep}
          setFirstPhaseQuestions={setFirstPhaseQuestions}
          setSecondPhaseQuestions={setSecondPhaseQuestions}
        />) : step == 'admin' ? (<Admin stompClient={stompClient} setStep={setStep} teamList={teamList} />) : (<Exam2 competitionName={competitionName} secondPhaseQuestions={secondPhaseQuestions} setStep={setStep} />)}
    </div>
  );
}

export default App;


