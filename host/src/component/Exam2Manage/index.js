import React, { useEffect, useState } from 'react'
import { Space, Input, Button } from 'antd'
import axiosInstance from '../../importAxios'

const { TextArea } = Input;
const initState = {
  question: '',
  answer: '',
}

const Exam2Manage = ({ selectedOptionCompetition, dataExam2, imgExam2 }) => {
  const [info, setInfo] = useState(initState)
  const [imgLink, setImgLink] = useState(imgExam2)
  const [dataExam, setDataExam] = useState([])
  const { question, answer } = info;
  useEffect(() => {
    setDataExam(dataExam2)
    setImgLink(imgExam2)
  },[dataExam2])
  const handleChangeInput = e => {
    const { name, value } = e.target
    setInfo({ ...info, [name]: value })
  }

  const handleUpdateImgLink = async () => {
    try {
      const response = await axiosInstance.put(`competition/${selectedOptionCompetition}?image=${imgLink}`);
      const tmpData = response.data;
    } catch (error) {
      console.error(error);
    }
  }
  
  const handleAddNewQuestion = async () => {
    const tmpInfo = {
      courseId: null,
      competitionId: selectedOptionCompetition,
      question: info.question,
      answer: info.answer,
      type: "SECOND_PHASE",
      mediaType: null,
      mediaLink: null
    }
    try {
      const response = await axiosInstance.post(`/question`, tmpInfo);
      const data = response.data;
      const newData = [...dataExam];
      newData.push(data)
      setDataExam(newData)
      setInfo(initState)
    } catch (error) {
      console.error(error);
    }

  }

  return (
    <Space className='exam2-manage-container' direction='vertical'>
      <Space direction='horizontal'>
        <h4>Thông tin hình ảnh</h4>
        <Input name='imgLink' value={imgLink} onChange={(e) => setImgLink(e.target.value)} style={{ width: '500px' }} />
        <Button onClick={handleUpdateImgLink}>Cập nhật</Button>
      </Space>
      <Space >
        <div className='divider' style={{ width: '850px', borderStyle: 'solid', borderWidth: '1px', borderColor: 'black', backgroundColor: 'red' }}></div>
      </Space>
      <Space direction='horizontal'>
        <h4>Thêm câu hỏi mới </h4>
        <TextArea name='question' value={question} onChange={handleChangeInput} style={{ width: '300px' }} placeholder='Câu hỏi' />
        <TextArea name='answer' value={answer} onChange={handleChangeInput} style={{ width: '300px' }} placeholder='Đáp án' />
        <Button onClick={handleAddNewQuestion}>Thêm</Button>
      </Space>
      <Space >
        <div className='divider' style={{ width: '850px', borderStyle: 'solid', borderWidth: '1px', borderColor: 'black', backgroundColor: 'red' }}></div>
      </Space>
      <Space className='list-question' direction='vertical'>
        <h1>Danh sách câu hỏi</h1>
        {dataExam.map((item) => {
          return (
            <Space direction='horizontal'>
              <h2>{item.name}</h2>
              <TextArea value={item.content} style={{ width: '300px' }} />
              <TextArea value={item.correctAnswers.content} style={{ width: '300px' }} />
            </Space>
          )
        })}

      </Space>
    </Space>
  )
}

export default Exam2Manage