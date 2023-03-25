import React from 'react'
import ModalExam2 from '../ModalExam2';
import { useState } from 'react';
import { Modal, Button } from 'antd';
import './Exam2.css'
import axiosInstance from '../../importAxios'

const Exam2 = ({secondPhaseQuestions, setStep, listAnswer}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tmpDataChild, setTmpDataChild] = useState();
    const [zIndices, setZindices] = useState(JSON.parse(localStorage.getItem('arrExam2')))
    const arrQuestion = secondPhaseQuestions.secondPhaseQuestions;
    const [indexSelected, setIndexSelected] = useState(-1)
    console.log(arrQuestion);
    const showModal = async () => {
        setIsModalOpen(true)
    }
    console.log(tmpDataChild);

    const handleOk = async () => {
        const newZIndices = [...zIndices];
        newZIndices[indexSelected + 1] = -2;
        localStorage.setItem("arrExam2", JSON.stringify(newZIndices))
        await setZindices(newZIndices)
        console.log(zIndices);
        setIsModalOpen(false)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const handleClick = async (dataChild, index) => {
        console.log(dataChild.id);
        setTmpDataChild(dataChild)
        const response = await axiosInstance.post(`/question/${dataChild.id}/start`);
        showModal();
        setIndexSelected(index)
    }

    




    return (
        <>
            <div className='exam2-container'>
            <img className='img-hide' src={"https://cdn.pixabay.com/photo/2015/04/19/08/32/rose-729509__340.jpg"}>
                </img>
                <div
                    style={{ zIndex: zIndices[1]}}
                    onClick={() => handleClick(arrQuestion[0], 0)}
                    className='piece-1' >

                </div>
                <div 
                    style={{ zIndex: zIndices[2] }}
                    onClick={() => handleClick(arrQuestion[1], 1)}
                    className='piece piece-2'
                >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[2], 2)}
                    style={{ zIndex: zIndices[3] }}
                    className='piece piece-3' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[3], 3)}
                    style={{ zIndex: zIndices[4] }}
                    className='piece piece-4' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[4], 4)}
                    style={{ zIndex: zIndices[5] }}
                    className='piece piece-5' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[5], 5)}
                    style={{ zIndex: zIndices[6] }}
                    className='piece piece-6' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[6], 6)}
                    style={{ zIndex: zIndices[7] }}
                    className='piece piece-7' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[7], 7)}
                    style={{ zIndex: zIndices[8] }}
                    className='piece piece-8' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[8], 8)}
                    style={{ zIndex: zIndices[9] }}
                    className='piece piece-9' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[9], 9)}
                    style={{ zIndex: zIndices[10] }}
                    className='piece piece-10' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[10], 10)}
                    style={{ zIndex: zIndices[11] }}
                    className='piece piece-11' >

                </div>
                <div
                    onClick={() => handleClick(arrQuestion[11], 11)}
                    style={{ zIndex: zIndices[12]}}
                    className='piece piece-12' >

                </div>

                <h1 style={{ zIndex: zIndices[1] }} className='piece-text-1'>1</h1>
                <h1 style={{ zIndex: zIndices[2] }} className='piece-text-2'>2</h1>
                <h1 style={{ zIndex: zIndices[3] }} className='piece-text-3'>3</h1>
                <h1 style={{ zIndex: zIndices[4] }} className='piece-text-4'>4</h1>
                <h1 style={{ zIndex: zIndices[5] }} className='piece-text-5'>5</h1>
                <h1 style={{ zIndex: zIndices[6] }} className='piece-text-6'>6</h1>
                <h1 style={{ zIndex: zIndices[7] }} className='piece-text-7'>7</h1>
                <h1 style={{ zIndex: zIndices[8] }} className='piece-text-8'>8</h1>
                <h1 style={{ zIndex: zIndices[9] }} className='piece-text-9'>9</h1>
                <h1 style={{ zIndex: zIndices[10] }} className='piece-text-10'>10</h1>
                <h1 style={{ zIndex: zIndices[11] }} className='piece-text-11'>11</h1>
                <h1 style={{ zIndex: zIndices[12] }} className='piece-text-12'>12</h1>
            </div>

            <Button 
                style={{position: 'absolute' , top: '0' , left: '0'}} 
                onClick={() => setStep('homepage')}            
            >Back To Homepage</Button>

            <Modal className='sizeModal' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <ModalExam2 listAnswer={listAnswer} tmpDataChild={tmpDataChild} />
            </Modal>



        </>
    )
}

export default Exam2