import React from 'react'

import { Card, Space, Typography, Modal, Select } from 'antd'
import { useState, useEffect } from 'react';
import './Exam1.css'
import axiosInstance from '../../importAxios'
import {toast} from  'react-hot-toast'

const { Title } = Typography;

const Exam1 = ({ setStep, firstPhaseQuestions, competitionName, teamList , setTeamIdSelected}) => {
    const { Option } = Select;
    const [zIndices, setZindices] = useState(JSON.parse(localStorage.getItem('arrExam1')))
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataPhase, setDataPhase] = useState({});
    const [indexCourse, setIndexCourse] = useState(0);
    const [teamCodeSeleted, setTeamCodeSelected] = useState("");
   

    const showModal = async (item, index) => {
        await setDataPhase(item)
        await setIndexCourse(index)
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        if (teamCodeSeleted != "") {
            const response = await axiosInstance.post(`/course/${dataPhase.id}/start?teamCode=${teamCodeSeleted}`);
            handleChooseQuestionSet(dataPhase, indexCourse)
            setIsModalOpen(false);
        } else
            toast.error("Vui lòng chọn đội", {position: 'top-right'})
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleChooseQuestionSet = (item, index) => {
        const newZIndices = [...zIndices];
        newZIndices[index + 1] = -2;
        setZindices(newZIndices);
        const data = item.questions;
        data.sort((a, b) => a.id - b.id);
        localStorage.setItem('arrExam1', JSON.stringify(newZIndices));
        const dataQuestionSet = {
            name: `Bộ  ${index + 1}`,
            ...data
        }

        localStorage.setItem('dataQuestionSet', JSON.stringify(dataQuestionSet))
        toast.success(`Chọn bộ câu hỏi ${index + 1}`, {position: 'top-right'})
        setStep('exam1Child');
    };

    useEffect(() => {
    }, [dataPhase])

    const handleChange = async (value, option) => {
        await setTeamIdSelected(option.data.id)
        setTeamCodeSelected(value)
    }; 

    return (
        <>
            <Space direction='vertical' className='exam1-container'>
                <Space className='exam1-title'>
                    <h1>{competitionName}</h1>
                </Space>

                <Space className='exam1-name'>
                    <h1 onClick={() => setStep('homepage')}>THEO DÒNG LỊCH SỬ</h1>
                </Space>
                <Space direction='vertical' className='box-container'>
                    <div className='list-card'>
                        {
                            firstPhaseQuestions.map((item, index) => {
                                return (
                                    <div className='card'
                                        style={{
                                            backgroundColor: zIndices[index + 1] === -2 ? 'white' : 'blue',
                                        }}
                                        onClick={() => showModal(item, index)}
                                    >
                                        <h2 label> <span className='circle-item'></span>{item.name}</h2>
                                    </div>
                                )
                            })

                        }
                    </div>
                </Space>
            </Space>

            <Modal title="CHỌN ĐỘI THI" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                <Select
                    style={{ width: '100%' }}
                    onChange={handleChange}>
                    {teamList.map((team) => (
                        <Option key={team.data.teamCode} value={team.data.teamCode} data={team.data}>
                            {team.data.name}
                        </Option>
                    ))}
                </Select>


            </Modal>
        </>
    )
}

export default Exam1