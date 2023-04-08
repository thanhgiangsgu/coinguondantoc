import { useState, useEffect, useRef } from 'react';
import './App.css';
import Exam1 from './component/Exam1';
import Exam2 from './component/Exam2';
import Exam1Child from './component/Exam1Child';
import HomePage from './component/HomePage';
import Admin from './component/Admin';

import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs';
import './fonts.css';
import './index.css'


var stompClient = null;

function App() {
  const [step, setStep] = useState('admin')
  const [firstPhaseQuestions, setFirstPhaseQuestions] = useState({});
  const [secondPhaseQuestions, setSecondPhaseQuestions] = useState({})
  const [stompClient, setStompClient] = useState(null)
  const [teamList, setTeamList] = useState([])
  const [teamIdSelected, setTeamIdSelected] = useState(0);
  const [bellRingingTeam, setBellRingingTeam] = useState({})
  const competition = JSON.parse(localStorage.getItem('dataCompetition')) || {};
  const competitionName = competition.name || "";
  const [isConfirmAns, setIsConfirmAns] = useState(false);
  const audioRef = useRef();
  if (!localStorage.getItem('summaryTeamScores')) {
    console.log("khong ton tai");
    localStorage.setItem('summaryTeamScores', JSON.stringify(competition.teams) || []);
  }

  const updateTeamList = (jsonObject) => {
    // console.log("join to team connected");
    // const newTeamList = [...teamList];
    // console.log("newTeamList : " , newTeamList);
    // newTeamList.push(jsonObject);
    // console.log("newTeamList after update : " , newTeamList);
    // setTeamList(newTeamList);
    // console.log("teamList after update : " , teamList);
    const newTeamList = JSON.parse(localStorage.getItem('teamList')) || [];
    let check = true;
    console.log(jsonObject);
    newTeamList.forEach(element => {
      console.log(element);
      if (element.data.id == jsonObject.data.id){
        console.log("co vao day");
        check = false;
      }
    });
    if (check) {
      newTeamList.push(jsonObject)
    }
    localStorage.setItem('teamList', JSON.stringify(newTeamList))
    setTeamList(newTeamList)
  }
  
  useEffect(() => {
    var socket = new SockJS('http://14.225.192.174:8111/gs-guide-websocket');
    const stompClient = Stomp.over(socket)
    stompClient.connect({}, function () {
      setStompClient(stompClient)
      stompClient.subscribe('/topic/host', function (message) {
        const jsonObject = JSON.parse(message.body);
        console.log(jsonObject);
        if (jsonObject.cmd == "TEAM_CONNECTED") {
          updateTeamList(jsonObject)
        }
        if (jsonObject.cmd == "TEAM_ANSWER") {
          localStorage.removeItem('listAnswer')
          localStorage.setItem('listAnswer', JSON.stringify(jsonObject.data));
        }
        if (jsonObject.cmd == "TEAM_BELL") {
          audioRef.current.play()
          setBellRingingTeam(jsonObject.data);
          setIsConfirmAns(true)
        }
        // setListTeamData(prevListTeamData => [...prevListTeamData, teamCode]);
      });
    })
  }, [])

  return (
    <div>
      <audio ref={audioRef}>
        <source src="/sound/bell.mp3" type="audio/mp3" />
      </audio>
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
        />) : step == 'admin' ? (<Admin setTeamList={setTeamList} stompClient={stompClient} setStep={setStep} teamList={teamList} />) :
          (<Exam2
            competitionName={competitionName}
            secondPhaseQuestions={secondPhaseQuestions}
            setStep={setStep}
            bellRingingTeam={bellRingingTeam}
            setBellRingingTeam={setBellRingingTeam}
            setIsConfirmAns={setIsConfirmAns}
            isConfirmAns={isConfirmAns}
          />)}
    </div>
  );
}

export default App;


