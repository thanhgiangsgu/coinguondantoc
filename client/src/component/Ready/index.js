import React from 'react'
import './Ready.css'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs';
import { useState, useEffect } from 'react'
import { message } from 'antd';

const Ready = ({ teamName, score, phase, message }) => {
  if (phase == 0) {
    return (
      <div className="container">
        <div className="box-title">
          <h1>XIN CHÀO</h1>
          <h6 style={{ float: 'right' }}>Tên đội : {teamName}</h6>
          <br></br>
          <h6 style={{ float: 'right' }}>Điểm hiện tại : {score}</h6>
        </div>
      </div>
    );
  } else if (phase == 1) {
    if (message == "") {
      return (<div className="container">
        <div className="box-title">
          <h1>PHẦN THI THỨ 1</h1>
        </div>
      </div>)
    } else {
      return (<div className="container">
        <div className="box-title">
          <h1>{message}</h1>
        </div>
      </div>)
    }
  } else if (phase === 2) {
    return (
      <div className="container">
        <div className="box-title">
          <h1>PHẦN THI THỨ 2</h1>
        </div>
      </div>
    )
  } else return null

};

export default Ready