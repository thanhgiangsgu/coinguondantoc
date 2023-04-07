import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Space, Card, Button, Modal, Image } from 'antd'
import './Exam1Child.css'
import axiosInstance from '../../importAxios'
import { toast } from 'react-hot-toast'


const Exam1Child = ({ setStep, competitionName, teamIdSelected }) => {

  const [ques, setQues] = useState("");
  const [ans, setAns] = useState("");
  const [timeLeft, setTimeLeft] = useState(-1);
  const tmpData = JSON.parse(localStorage.getItem('dataQuestionSet'))
  const [isSelectedImgButton, setIsSelectedImgButton] = useState(true);
  const [isSelectedVideoButton, setIsSelectedVideoButton] = useState(true);
  const [isShowConfirmAnswer, setIsShowConfirmAnswer] = useState(true)
  const [mediaLink, setMediaLink] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionId, setQuestionId] = useState(0);
  const audioRef = useRef(null);
 
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
    if (timeLeft < 1) {
      handleStopQuestion();
      return
    }
    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleStopQuestion = async () => {
    const response = await axiosInstance.post(`/question/${questionId}/stop`)
  }

  const handleClickQuesCard = async (index) => {
    setIsShowConfirmAnswer(true)
    setQues(tmpData[index].content)
    setQuestionId(tmpData[index].id)
    const response = await axiosInstance.post(`/question/${tmpData[index].id}/start`)
    if (tmpData[index].mediaType == "IMAGE") {
      setIsSelectedImgButton(false);
      setIsSelectedVideoButton(true);
      setMediaLink(tmpData[index].mediaLink)
    } else if (tmpData[index].mediaType == "VIDEO") {
      setIsSelectedImgButton(true);
      setIsSelectedVideoButton(false);
      const videoUrl = tmpData[index].mediaLink;
      const videoId = videoUrl.split('v=')[1];
      const embeddedUrl = `https://www.youtube.com/embed/${videoId}`;
      setMediaLink(embeddedUrl)
    } else {
      setIsSelectedImgButton(true);
      setIsSelectedVideoButton(true);

    }

    setAns("")
  }

  const handleClickAnsCard = (index) => {

    setAns(tmpData[index].correctAnswers.content)
    setIsShowConfirmAnswer(false)
  }

  const handleUpdateScore = async () => {
    let score = 10;
    const dataScore = {
      phase: 1,
      questionId: questionId,
      team: teamIdSelected,
      score: score,
    }
    const response = await axiosInstance.post(`/score`, dataScore)
    localStorage.setItem('summaryTeamScores', JSON.stringify(response.data))
    setIsShowConfirmAnswer(true)
    toast.success(`Cập nhật điểm thành công`)

  }

  const handleClickCountingTime = () => {
    audioRef.current.play();
    console.log("sound");
    setTimeLeft(15);
  }

  return (
    <div className='exam1-child-container'>
      <audio ref={audioRef}>
        <source src="/sound/countdown15s.mp3" type="audio/mp3" />
      </audio>
      <Space direction='vertical'>
        <Space className='exam1-title'>
          <h1>{competitionName}</h1>
        </Space>
        <Space direction='horizontal'>
          <Space direction='vertical'>
            <Space className='box-exam1'>
              <Space className='exam1-name'>
                <h1>THEO DÒNG LỊCH SỬ</h1>
              </Space>

              <div className='question-set'>
                <h1 onClick={() => setStep('exam1')}>{tmpData.name}</h1>
              </div>

            </Space>

            <Space direction='vertical' className='box-exam1'>
              <Space>
                <h6>Câu hỏi</h6>
              </Space>
              <Space className='show-ques'>
                <h1 style={{fontSize: '35px', color: 'crimson'}}>{ques}</h1>
              </Space>



            </Space>

            <Space direction='vertical' className='box-exam1'>

              <Space>
                <h6>Câu trả lời</h6>
              </Space>
              <Space>
                <Space className='show-ans'>
                  <h1 style={{fontSize: '35px', color: 'blue'}}>{ans}</h1>

                </Space>


                <div className="countdown-timer">
                  <span>{timeLeft == -1 ? 15 : timeLeft}</span>
                </div>

              </Space>

            </Space>
          </Space>
          <Space>
            <div className='list-question-box'>
              <Space direction='vertical'>
                <Space>
                  <Space direction='horizontal' style={{ justifyContent: 'center' }}>
                    <Space direction='vertical' className='list-ques'>
                      <Card
                        onClick={() => handleClickQuesCard(0)}
                        className='card-item' style={{ backgroundColor: 'pink' }}>1</Card>
                      <Card
                        onClick={() => handleClickQuesCard(1)}
                        className='card-item' style={{ backgroundColor: 'burlywood' }}>2</Card>
                      <Card
                        onClick={() => handleClickQuesCard(2)}
                        className='card-item' style={{ backgroundColor: 'pink' }}>3</Card>
                      <Card
                        onClick={() => handleClickQuesCard(3)}
                        className='card-item' style={{ backgroundColor: 'burlywood' }}>4</Card>
                      <Card
                        onClick={() => handleClickQuesCard(4)}
                        className='card-item' style={{ backgroundColor: 'pink' }}>5</Card>

                    </Space>

                    <Space direction='vertical' className='list-ans'>
                      <Card
                        onClick={() => handleClickAnsCard(0)}
                        className='card-item' style={{ backgroundColor: 'blanchedalmond' }}>1</Card>
                      <Card
                        onClick={() => handleClickAnsCard(1)}
                        className='card-item' style={{ backgroundColor: 'orangered' }}>2</Card>
                      <Card
                        onClick={() => handleClickAnsCard(2)}
                        className='card-item' style={{ backgroundColor: 'blanchedalmond' }}>3</Card>
                      <Card
                        onClick={() => handleClickAnsCard(3)}
                        className='card-item' style={{ backgroundColor: 'orangered' }}>4</Card>
                      <Card
                        onClick={() => handleClickAnsCard(4)}
                        className='card-item' style={{ backgroundColor: 'blanchedalmond' }}>5</Card>

                    </Space>
                  </Space>
                </Space>
                <Space direction='vertical'>
                  <Button className='button-control' type='primary' onClick={handleClickCountingTime}>Đếm giờ</Button>
                  <Button onClick={() => setIsModalOpen(true)} disabled={isSelectedImgButton} className='button-control' type='primary'>Hình ảnh</Button>
                  <Button onClick={() => setIsModalOpen(true)} disabled={isSelectedVideoButton} className='button-control' type='primary'>Video</Button>
                  <Button onClick={handleUpdateScore} disabled={isShowConfirmAnswer} className='button-control' type='primary'>Trả lời đúng</Button>
                </Space>
              </Space>
            </div>
          </Space>
        </Space>
        <Modal className='modal-media' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          {!isSelectedImgButton && <Image src={mediaLink} />}
          {!isSelectedVideoButton &&
            <iframe
              title="Video player"
              width="100%"
              height="700"
              src={mediaLink}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          }
        </Modal>
      </Space>
    </div>


  )
}

export default Exam1Child