import React from 'react'
import { Space, Input } from 'antd'
import { useState, useEffect } from 'react'
import './Welcome.css'
import { toast } from 'react-hot-toast'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs';
const Welcome = ({ setStep, sendDataToServer }) => {
  const [code, setCode] = useState("")
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      if (code === '') {
        toast.error('Vui lòng nhập tên đội', {
          position: 'top-right',
        });
      } else {
        sendDataToServer(code)
      }
    }
  }



  return (
    <div className="app">
      <div className="container">
        <div className="home">
          <div className="home-text">
            <h1>Chào mừng đến với cội nguồn dân tộc</h1>

            <h1>Nhập Team Code </h1>
          </div>
          <div className="home-input">
            <Input
              value={code}
              onKeyPress={handleKeyPress}
              onChange={(e) => setCode(e.target.value)}
              className="input"
            ></Input>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Welcome