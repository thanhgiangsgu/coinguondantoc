import React, { useEffect, useRef } from 'react'
import ModalExam2 from '../ModalExam2';
import { useState } from 'react';
import { Modal, Button, Space, Input} from 'antd';
import './Exam2.css'
import { toast } from 'react-hot-toast'
import axiosInstance from '../../importAxios'

const Exam2 = ({ secondPhaseQuestions, setStep, listAnswer, competitionName, bellRingingTeam, setBellRingingTeam, setIsConfirmAns, isConfirmAns }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateScoreModalOpen, setIsUpdateScoreModalOpen] = useState(false)
    const [tmpDataChild, setTmpDataChild] = useState();
    const [zIndicesPiece, setZindicesPiece] = useState(JSON.parse(localStorage.getItem('arrExam2Piece')))
    const [zIndicesNumber, setZindicesNumber] = useState(JSON.parse(localStorage.getItem('arrExam2Number')))
    const arrQuestion = secondPhaseQuestions.secondPhaseQuestions;
    const [indexSelected, setIndexSelected] = useState(-1)
    const [scorePhaseSecond, setScorePhaseSecond] = useState(0);
    const secondPhaseImage = secondPhaseQuestions.secondPhaseImage;
    
    


    console.log(competitionName);
    const showModal = async () => {
        setIsModalOpen(true)
    }

    const openBell = async () => {
        const response = await axiosInstance.post(`/bell/open`);
    } 

    useEffect(() => {
        setBellRingingTeam({})
        setIsConfirmAns(false)
        openBell();
    }, [])

    const handleOk = async () => {
        const newZIndices = [...zIndicesPiece];
        newZIndices[indexSelected + 1] = -2;
        localStorage.setItem("arrExam2Piece", JSON.stringify(newZIndices))
        await setZindicesPiece(newZIndices)
        const newZIndicesNumber = [...zIndicesNumber];
        newZIndicesNumber[indexSelected + 1] = -2;
        localStorage.setItem("arrExam2Number", JSON.stringify(newZIndicesNumber))
        await setZindicesNumber(newZIndicesNumber)

        setIsModalOpen(false)
    }

    const handleOkUpdateScoreModal = () => {
        handleUpdateScore(scorePhaseSecond)
        setIsUpdateScoreModalOpen(false)
    }

    const handleCancel = async () => {
        const newZIndices = [...zIndicesNumber]
        newZIndices[indexSelected + 1] = -2;
        localStorage.setItem("arrExam2Number", JSON.stringify(newZIndices))
        await setZindicesNumber(newZIndices)
        setIsModalOpen(false)
    }

    const handleCancelUpdateScoreModal = () => {
        setIsUpdateScoreModalOpen(false)
    }

    const handleClick = async (dataChild, index) => {
        if (zIndicesNumber[index + 1] > 0) {
            await setTmpDataChild(dataChild)
            const response = await axiosInstance.post(`/question/${dataChild.id}/start`);
            showModal();
            setIndexSelected(index)
        } else {
            toast.error("Không thể chọn mảnh ghép đã trả lời")
        }
    }

    const handleClickRingOpen = async () => {
        setBellRingingTeam({})
        setIsConfirmAns(false)
        const response = await axiosInstance.post(`/bell/open`);
        console.log("join to handleClickRingOpen");
        console.log(response.data);
    }

    const handleUpdateScore = async (score) => {
        if (score == 0){
            handleClickRingOpen();
        }
        
        const dataScore = {
            phase: 2,
            questionId: tmpDataChild.id,
            team: bellRingingTeam.id,
            score: score,
        }
        const response = await axiosInstance.post(`/score`, dataScore)
        localStorage.setItem('summaryTeamScores', JSON.stringify(response.data))
        toast.success(`Cập nhật điểm thành công`)
    }

    const handleOpenModalUpdateScore = async () => {
        console.log(tmpDataChild);
        setScorePhaseSecond(0);
        setIsUpdateScoreModalOpen(true)
    }

    // const handleUpdateScore = async () => {
    //     let score = 10;
    //     const dataScore = {
    //       phase: 1,
    //       questionId: questionId,
    //       team: teamIdSelected,
    //       score: score,
    //     }
    //     const response = await axiosInstance.post(`/score`, dataScore)
    //     localStorage.setItem('summaryTeamScores', JSON.stringify(response.data))
    //     setIsShowConfirmAnswer(true)
    //     toast.success(`Cập nhật điểm thành công`)

    //   }

    return (
        <>
            <div className='exam2-container'>
                <img className='img-hide' src={secondPhaseImage}>
                </img>
                <div
                    style={{ zIndex: zIndicesPiece[1] }}
                    onClick={() => handleClick(arrQuestion[0], 0)}
                    className='piece-1' >

                </div>
                <div
                    style={{ zIndex: zIndicesPiece[2] }}
                    onClick={() => handleClick(arrQuestion[1], 1)}
                    className='piece piece-2'
                >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[2], 2)}
                    style={{ zIndex: zIndicesPiece[3] }}
                    className='piece piece-3' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[3], 3)}
                    style={{ zIndex: zIndicesPiece[4] }}
                    className='piece piece-4' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[4], 4)}
                    style={{ zIndex: zIndicesPiece[5] }}
                    className='piece piece-5' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[5], 5)}
                    style={{ zIndex: zIndicesPiece[6] }}
                    className='piece piece-6' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[6], 6)}
                    style={{ zIndex: zIndicesPiece[7] }}
                    className='piece piece-7' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[7], 7)}
                    style={{ zIndex: zIndicesPiece[8] }}
                    className='piece piece-8' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[8], 8)}
                    style={{ zIndex: zIndicesPiece[9] }}
                    className='piece piece-9' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[9], 9)}
                    style={{ zIndex: zIndicesPiece[10] }}
                    className='piece piece-10' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[10], 10)}
                    style={{ zIndex: zIndicesPiece[11] }}
                    className='piece piece-11' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[11], 11)}
                    style={{ zIndex: zIndicesPiece[12] }}
                    className='piece piece-12' >

                </div>

                <h1 style={{ zIndex: zIndicesNumber[1] }} className='piece-text-1'>1</h1>
                <h1 style={{ zIndex: zIndicesNumber[2] }} className='piece-text-2'>2</h1>
                <h1 style={{ zIndex: zIndicesNumber[3] }} className='piece-text-3'>3</h1>
                <h1 style={{ zIndex: zIndicesNumber[4] }} className='piece-text-4'>4</h1>
                <h1 style={{ zIndex: zIndicesNumber[5] }} className='piece-text-5'>5</h1>
                <h1 style={{ zIndex: zIndicesNumber[6] }} className='piece-text-6'>6</h1>
                <h1 style={{ zIndex: zIndicesNumber[7] }} className='piece-text-7'>7</h1>
                <h1 style={{ zIndex: zIndicesNumber[8] }} className='piece-text-8'>8</h1>
                <h1 style={{ zIndex: zIndicesNumber[9] }} className='piece-text-9'>9</h1>
                <h1 style={{ zIndex: zIndicesNumber[10] }} className='piece-text-10'>10</h1>
                <h1 style={{ zIndex: zIndicesNumber[11] }} className='piece-text-11'>11</h1>
                <h1 style={{ zIndex: zIndicesNumber[12] }} className='piece-text-12'>12</h1>
            </div>
            {!bellRingingTeam.name ?
                <h1 className='req-ans'>Thông tin đội yêu cầu trả lời câu hỏi</h1> : 
                <Space direction='horizontal' className='bell-item'>
                    <img className='bell-img' src='img/bell.png'></img>
                    <h1 className='req-ans'>{bellRingingTeam.name}</h1>    
                </Space>}
            <Button
                style={{ position: 'absolute', top: '0', left: '0' }}
                onClick={() => setStep('homepage')}
            >Trở về trang chủ</Button>
            {/* <Button
                onClick={handleClickRingOpen}
                type='primary'
                style={{ float: 'left', fontSize: '30px', margin: '30px', width: '300px', height: '80px' }}
            >Mở chuông</Button> */}
            {isConfirmAns &&
                <>
                    <Button
                        onClick={handleOpenModalUpdateScore}
                        type='primary'
                        style={{ float: 'right', fontSize: '20px', marginRight: '10px', width: '200px', height: '50px' }}
                    >Đúng</Button>
                    <Button
                        onClick={() => handleUpdateScore(0)}
                        type='primary'
                        danger
                        style={{ float: 'right', fontSize: '20px', marginRight: '10px', width: '200px', height: '50px' }}
                    >Sai</Button>
                </>
            }

            <Modal className='sizeModal' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <ModalExam2 competitionName={competitionName} listAnswer={listAnswer} tmpDataChild={tmpDataChild} />
            </Modal>
            <Modal title="Cộng điểm" open={isUpdateScoreModalOpen} onOk={handleOkUpdateScoreModal} onCancel={handleCancelUpdateScoreModal}>
                <Input name={scorePhaseSecond} value={scorePhaseSecond} onChange={(e) => setScorePhaseSecond(e.target.value)} style={{ height: '50px', fontSize: '40px', textAlign: 'center' }} />
            </Modal>


        </>
    )
}

export default Exam2