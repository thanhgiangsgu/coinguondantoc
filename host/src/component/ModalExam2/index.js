import React from 'react'
import { Space, Button, Modal } from 'antd'
import './ModalExam2.css'
import { useState, useEffect } from 'react'
import axiosInstance from '../../importAxios' 
import { toast } from 'react-hot-toast'



const ModalExam2 = (tmpDataChild) => {
    const listAnswer = JSON.parse(localStorage.getItem('listAnswer'))
    const info = tmpDataChild.tmpDataChild
    console.log(info);
    const [timeLeft, setTimeLeft] = useState(-1);
    const [showAns, setShowAns] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isShowAnswer, setIsShowAnswer] = useState(false);

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

    useEffect(() => {
        setShowAns("");
        setTimeLeft(-1)
    }, [tmpDataChild])

    const handleStopQuestion = async () => {
        const response = await axiosInstance.post(`/question/${info.id}/stop`);
    }

    const handleUpdateScore = async (check, teamId , name) => {
        let score = 0;
        if (check) score = 5;
        const dataScore = {
            phase: 2,
            questionId: info.id,
            team: teamId,
            score: score,
        }
        const response = await axiosInstance.post(`/score`, dataScore)
        toast.success(`Cập nhật điểm thành công cho ${name}`) 
    }


    return (
        <div className='modal-container'>
            <Space className='exam2-title'>
                <h1>HỘI THI TÌM HIỂU LỊCH SỬ CỘI NGUỒN DÂN TỘC LẦN THỨ XV</h1>
            </Space>
            <Space>
                <h1>HÀNH TRÌNH ĐẾN ĐỊA CHỈ ĐỎ</h1>
            </Space>

            <Space>
                <Space className='show-question'>
                    <h3 className='question-content'><span className='question-order'>{info.name}: </span>{info.content}</h3>
                </Space>
            </Space>

            <Space>
                <Space direction='horizontal'>
                    <Space className='ans-box'>
                        <h1>{showAns}</h1>
                    </Space>
                    <Space className='countdown-timer'>
                        {timeLeft == -1 ? 20 : timeLeft}
                    </Space>
                    <Space className='box-control'>
                        <Space direction='vertical'>
                            <Button className='button-control' type='primary' onClick={() => setTimeLeft(20)}>Đếm giờ</Button>
                            <Button className='button-control' type='primary' onClick={() => setShowAns(info.correctAnswers.content)}>Hiện câu trả lời</Button>
                            <Button onClick={() => showModal()} className='button-control' type='primary'>Xem câu trả lời của các nhóm</Button>
                        </Space>
                    </Space>
                </Space>
            </Space>

            <Modal className='answer-modal' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Space className='answer-modal-container' direction='vertical'>
                    <Space style={{ width: '1150px', display: 'flex', justifyContent: 'space-between' }}>
                        <h1 className='modal-title'>
                            THÔNG TIN CÁC CÂU TRẢ LỜI
                        </h1>
                        <Button onClick={() => setIsShowAnswer(!isShowAnswer)} type='primary'>Ẩn/Hiện câu trả lời</Button>
                    </Space>
                    <div className='list-answer'>
                        {listAnswer.map((answerItem) => {
                            return (
                                <div className='answer-item'>
                                    <h2 className='team-name'>{answerItem.name}</h2>
                                    <h3 className='team-answer'>{isShowAnswer ? (answerItem.answer !== "" ? answerItem.answer : "Chưa đưa ra câu trả lời") : "Câu trả lời đã được ẩn"}</h3>
                                    <Button onClick={() => handleUpdateScore(true, answerItem.id,answerItem.name)} style={{float: 'right'}} type='primary'>Đúng</Button> <Button onClick={() =>handleUpdateScore(false, answerItem.id, answerItem.name)} style={{float: 'right'}} type='primary' danger>Sai</Button>
                                </div>
                            )
                        })}
                    </div>
                </Space>
            </Modal>

        </div>
    )
}

export default ModalExam2