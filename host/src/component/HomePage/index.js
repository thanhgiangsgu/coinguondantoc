import React from 'react'
import { Space } from 'antd'
import './HomePage.css'
import { useState } from 'react'
import { Button, Input, Modal } from 'antd'
import axiosInstance from '../../importAxios'
import { toast } from 'react-hot-toast'

const initInfo = {
  username: "",
  password: "",
}

const HomePage = ({ setStep, setFirstPhaseQuestions, setSecondPhaseQuestions, competitionName }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTeamScoresModalOpen, setIsTeamScoresModalOpen] = useState(false)
  const [info, setInfo] = useState(initInfo)
  const { username, password } = info;
  const summaryTeamScores = JSON.parse(localStorage.getItem('summaryTeamScores') || '[]')
  summaryTeamScores.sort((a, b) => a.teamRank - b.teamRank);

  const sendDataToServer = () => {
    axiosInstance.post('/user/login', info)
      .then(response => {
        const { jwt, type } = response.data;
        localStorage.setItem("token", jwt)
        toast.success("Đăng nhập thành công", { position: 'top-right' })
        setStep('admin')
      })
      .catch(error => {
        toast.error("Tài khoản hoặc mật khẩu không đúng", { position: 'top-right' })
        console.error(error);

      });
  }

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    sendDataToServer()
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const showModalTeamScores = () => {
    setIsTeamScoresModalOpen(true);
  }

  const handleOkTeamScores = () => {
    setIsTeamScoresModalOpen(false)
  }

  const handleCancelTeamScores = () => {
    setIsTeamScoresModalOpen(false)
  }


  const handleClick = () => {
    if (localStorage.getItem('token')) {
      setStep('admin')
    } else
      showModal()
  }

  const handleChangeInput = (name, value) => {
    setInfo({ ...info, [name]: value })
  };

  const handleClickContest = async (idContest) => {
    try {
      if (localStorage.getItem('token')) {
        const response = await axiosInstance.post(`phase/${idContest}/start`);
        const data = response.data;
        if (idContest == 1) {
          setFirstPhaseQuestions(data)

          setStep('exam1')
        } else {
          setSecondPhaseQuestions(data);
          setStep('exam2')
        }
      } else {
        toast.error("Bạn chưa đăng nhập")
      }
    } catch (error) {
      toast.error("Có thể bạn chưa bắt đầu cuộc thi")
      console.error(error);
    }
  }

  return (
    <div className='homepage-container'>
      <img className='-img-item' src='img/anhbac.png'>
      </img>
      <Space direction='vertical'>
        <Space className='title'>{competitionName}
        </Space>
        <Space
          onClick={() => handleClickContest(1)}
          className='container-exam '>
          <h1 className='exam-title'>THEO DÒNG LỊCH SỬ</h1>
        </Space>
        <Space className='container-exam '
          onClick={() => handleClickContest(2)}
        >
          <h1 className='exam-title'>HÀNH TRÌNH ĐẾN ĐỊA CHỈ ĐỎ</h1>
        </Space>

        <Space className='admin-manager'>
          <Button onClick={handleClick}>Quản lý câu hỏi</Button>
          <Button type='primary' onClick={showModalTeamScores}>Xem điểm các đội</Button>
        </Space>

        <Space className='school-name-box'>
          <h1 className='school-name'>TRƯỜNG THPT NGUYỄN QUANG DIÊU</h1>
          <div className='vertical-divider'>

          </div>
          <div className='horizontal-divider'>

          </div>
        </Space>
      </Space>


      <Modal title="Login Form" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <span>Tài khoản</span> <Input value={username} onChange={(e) => handleChangeInput("username", e.target.value)} />
        <span>Mật khẩu</span> <Input value={password} onChange={(e) => handleChangeInput("password", e.target.value)} />
      </Modal>

      <Modal title="Thông tin tổng hợp" open={isTeamScoresModalOpen} onOk={handleOkTeamScores} onCancel={handleCancelTeamScores}>
        <div className='summary-teamlist'>
          {
            summaryTeamScores.map((team) => {
              return (
                <div className='team-info'>
                  <h1 className='team-name'>{team.name}</h1>
                  <h1 className='team-score'>{team.score}</h1>
                </div>
              )
            })
          }
        </div>
      </Modal>
    </div>
  )
}

export default HomePage