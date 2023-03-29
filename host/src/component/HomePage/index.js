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

const HomePage = ({ setStep, setFirstPhaseQuestions, setSecondPhaseQuestions ,competitionName}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [info, setInfo] = useState(initInfo)
  const { username, password } = info;

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
        </Space>
      </Space>

      <Modal title="Login Form" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <span>Tài khoản</span> <Input value={username} onChange={(e) => handleChangeInput("username", e.target.value)} />
        <span>Mật khẩu</span> <Input value={password} onChange={(e) => handleChangeInput("password", e.target.value)} />
      </Modal>
    </div>
  )
}

export default HomePage