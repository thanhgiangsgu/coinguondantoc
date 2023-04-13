import React from 'react'
import { Space } from 'antd'
import './ShowAnswer.css'

const ShowAnswer = ({ phase, listAnswer, question }) => {
    return phase === 1 ? (
        <div className='container'>
            <div className='box-title'>
                <h2>{question.name}</h2>
                <br></br>
                <h4 style={{ color: 'crimson' }}>{question.content}</h4>
                <br></br>
                <br></br>
            </div>
            <h1 style={{ color: 'green' }}>Câu trả lời : {listAnswer.data}</h1>
        </div>
    ) : (
        <div className='container'>
            <h1 style={{ fontSize: '50px', fontWeight: '900', color: 'rebeccapurple', textShadow: '1px 1px' }}>Danh sách các câu trả lời</h1>
            <div className='box-title'>
                {listAnswer.data.map((team) => {
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