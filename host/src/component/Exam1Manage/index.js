import React, { useState, useEffect } from 'react'
import { Button, Space, Input, Modal } from 'antd'
import axiosInstance from '../../importAxios'
import './Exam1Manage.css'

const initState = {
  question: "",
  answer: "",
  imgLink: "",
  videoLink: "",
}

const Exam1Manage = ({ selectedOptionCompetition, dataExam1 }) => {
  const [coursesArr, setCoursesArr] = useState(dataExam1)
  const [courses, setCourses] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [info, setInfo] = useState(initState)
  const { question, answer, imgLink, videoLink } = info

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    setCoursesArr(dataExam1);
  }, [dataExam1]);
  const handleClickAddNewSourses = async () => {
    try {
      const response = await axiosInstance.post(`/course?competitionId=${selectedOptionCompetition}`);
      const tmpData = response.data;
      const newCoursesArr = [...coursesArr];
      newCoursesArr.push(tmpData)
      setCoursesArr(newCoursesArr)
    } catch (error) {
      console.error(error);
    }
  }

  const handleItemDetail = (item) => {
    setCourses(item);
    showModal();
  }

  const handleChangeInput = e => {
    const { name, value } = e.target
    setInfo({ ...info, [name]: value })
  }

  useEffect(() => {
  })

  const handleAddNewData = async () => {
    const tmpInfo = {
      courseId: courses.id,
      question: info.question,
      answer: info.answer,
      type: "ESSAY",
      mediaType: "",
      mediaLink: ""
    }
    if (imgLink != "") {
      tmpInfo.mediaType = "IMAGE";
      tmpInfo.mediaLink = info.imgLink;
    } else if (videoLink != "") {
      tmpInfo.mediaType = "VIDEO";
      tmpInfo.mediaLink = info.videoLink;
    } else tmpInfo.mediaType = null
    try {
      const response = await axiosInstance.post(`/question`, tmpInfo);
      const data = response.data;
      const newCourses = { ...courses };
      newCourses.questions.push(data);
      setCourses(newCourses)
      setInfo(initState)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
  }, [courses]);
  return (
    <Space className='exam1-manage-container' direction='vertical'>
      <Space>
        <Button onClick={handleClickAddNewSourses} type='primary'>Thêm bộ mới</Button>
      </Space>
      <Space className='courses-list' direction='vertical'>
        {coursesArr.map((item) => {
          return (
            <Space className='courses-item' direction='horizontal'>
              <h3 className='courses-item-name'>{item.name}</h3>
              <Button onClick={() => handleItemDetail(item)} className='courses-item-detail'>Xem chi tiết</Button>
            </Space>
          )
        })}
      </Space>

      <Modal className='sizeModal' title={courses.name} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Space direction='vertical'>
          <Space direction='horizontal'>
            <Space direction='vertical'>
              <h3>Câu hỏi</h3>
              <Input
                name='question'
                value={question}
                onChange={handleChangeInput}
                style={{ width: '280px' }} />
            </Space>
            <Space direction='vertical'>
              <h3>Câu trả lời đúng</h3>
              <Input
                name='answer'
                value={answer}
                onChange={handleChangeInput}
                style={{ width: '280px' }} />
            </Space>
            <Space direction='vertical'>
              <h3>Hình ảnh (nếu có)</h3>
              <Input
                disabled={videoLink !== "" ? true : false}
                name='imgLink'
                value={imgLink}
                onChange={handleChangeInput}
                style={{ width: '280px' }} />
            </Space>
            <Space direction='vertical'>
              <h3>Video (nếu có)</h3>
              <Input
                disabled={imgLink !== "" ? true : false}
                name='videoLink'
                value={videoLink}
                onChange={handleChangeInput}
                style={{ width: '280px' }} />
            </Space>
            <Space direction='vertical'>
              <h3>Trạng thái</h3>
              <Button disabled={question == "" || answer == ""} onClick={handleAddNewData} type='primary'>Lưu</Button>
            </Space>
          </Space>
          <Space >
            <div className='divider' style={{ width: '1200px', borderStyle: 'solid', borderWidth: '1px', borderColor: 'black', backgroundColor: 'red' }}></div>
          </Space>
          <Space className='list-question'>
            {courses.questions && courses.questions.map((question => {
              return (
                <div className='question-item'>
                  <h3>{question.name}</h3>
                  <h6>Câu hỏi : {question.content}</h6>
                  <h6>Câu trả lời đúng : {question.correctAnswers.content}</h6>
                  <h6>Dính kèm : {question.mediaLink}</h6>
                </div>
              )
            }))}
          </Space>
        </Space>
      </Modal>
    </Space>
  )
}

export default Exam1Manage