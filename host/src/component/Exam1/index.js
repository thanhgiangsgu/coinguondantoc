import React from 'react'

import { Card, Space, Typography, Modal, Select } from 'antd'
import { useState, useEffect } from 'react';
import './Exam1.css'
import axiosInstance from '../../importAxios'

const { Title } = Typography;

const Exam1 = ({ setStep, firstPhaseQuestions, competitionName, teamList , setTeamIdSelected}) => {
    console.log(teamList);
    const { Option } = Select;
    const [zIndices, setZindices] = useState(JSON.parse(localStorage.getItem('arrExam1')))
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataPhase, setDataPhase] = useState({});
    const [indexCourse, setIndexCourse] = useState(0);
    const [teamCodeSeleted, setTeamCodeSelected] = useState("");
   

    const showModal = async (item, index) => {
        console.log(index);
        await setDataPhase(item)
        console.log(dataPhase.id);
        await setIndexCourse(index)
        console.log(indexCourse);
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        console.log(teamCodeSeleted);
        console.log(indexCourse);
        if (teamCodeSeleted != "") {
            const response = await axiosInstance.post(`/course/${dataPhase.id}/start?teamCode=${teamCodeSeleted}`);
            handleChooseQuestionSet(dataPhase, indexCourse)
            setIsModalOpen(false);
        } else
            alert("vui long chon doi")
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
        console.log(data);
        localStorage.setItem('arrExam1', JSON.stringify(newZIndices));
        const dataQuestionSet = {
            name: `Bộ  ${index + 1}`,
            ...data
        }

        localStorage.setItem('dataQuestionSet', JSON.stringify(dataQuestionSet))
        console.log(dataQuestionSet);
        setStep('exam1Child');
    };

    useEffect(() => {
        console.log("data updated: ", dataPhase);
    }, [dataPhase])

    const handleChange = async (value, option) => {
        console.log(option);
        await setTeamIdSelected(option.data.id)
        console.log(option.data.id);
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