import React from 'react'
import { Input, Button } from 'antd';
import { useState } from 'react';
import './ShowQuestion.css'
const { TextArea } = Input;
const ShowQuestion = ({ question, sendAnswerToServer }) => {
  const [answer, setAnswer] = useState("")
  return question.type === "SECOND_PHASE" ? (
    <div className="container">
      <div className="box-title">
        <h3>{question.name}</h3>
        <br></br>
        <h6>{question.content}</h6>
        <TextArea value={answer} onChange={(e) => setAnswer(e.target.value)} cols={60} rows={5} className='input-answer' />
        <Button onClick={() => sendAnswerToServer(answer)} type='primary' className='button-answer'>GỬI CÂU TRẢ LỜI</Button>
      </div>
    </div>
  ) : (
    <div className="container">
      <div className="box-title">
        <h3>{question.name}</h3>
        <br></br>
        <h6>{question.content}</h6>
      </div>
    </div>
  );
}

export default ShowQuestion
