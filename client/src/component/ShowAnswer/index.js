import React from 'react'
import { Space } from 'antd'
import './ShowAnswer.css'

const ShowAnswer = ({ phase, listAnswer, question }) => {
    console.log(listAnswer);
    return phase === 1 ? (
        <div className='container'>
            <div className='box-title'>
                <h2>{question.name}</h2>
                <br></br>
                <h4 style={{ color: 'crimson' }}>{question.content}</h4>
                <br></br>
                <br></br>
            </div>
            <h1 style={{ color: 'green' }}>Câu trả lời : {listAnswer.data.correctAnswers.content}</h1>
        </div>
    ) : (
        <div className='container'>
            <h2 style={{ fontSize: '45px' }}>{listAnswer.data.question.name}</h2>
            <br></br>
            <h4 style={{ color: 'crimson', fontSize: '30px', width: '80%' }}>{listAnswer.data.question.content}</h4>
            
            <h2 style={{ color: 'green', marginTop: '15px' }}>Câu trả lời : {listAnswer.data.question.correctAnswers.content}</h2>
            <h1 style={{ fontSize: '50px', fontWeight: '900', color: 'rebeccapurple', textShadow: '1px 1px' }}>Danh sách các câu trả lời</h1>
            <div className='box-title'>

                {listAnswer.data.teamAnswerList.map((team) => {
                    return (
                        <Space direction='horizontal' className='list-answer'
                            style={{ width: '1000px', display: "flex", justifyContent: 'space-between' }}>
                            <h1>{team.name}</h1>
                            <h1 className={`${team.answer ? "has-answer" : "no-answer"}`}>
                                {team.answer != null ? team.answer : "Chưa đưa ra câu trả lờii"}
                            </h1>
                        </Space>
                    )
                })}
            </div>
        </div>
    )
}

export default ShowAnswer