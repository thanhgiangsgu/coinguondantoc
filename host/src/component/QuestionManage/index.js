import React, { useState, useEffect } from 'react'
import { Space, Button, Select } from 'antd'
import axiosInstance from '../../importAxios'
import Exam1Manage from '../Exam1Manage'
import Exam2Manage from '../Exam2Manage'

const QuestionManage = () => {
    const optionContests = [
        {
            value: '0',
            label: 'Chọn phần thi'
        },
        {
            value: '1',
            label: 'Phần thi 1'
        },
        {
            value: '2',
            label: 'Phần thi 2'
        }
    ]

    const optionCompetitions = [
        {
            value: '0',
            label: 'Chọn cuộc thi'
        },
    ]
    const [competitionList, setCompetitionList] = useState([])
    const [selectedOptionContest, setSelectedOptionContest] = useState(optionCompetitions[0]);
    const [selectedOptionCompetition, setSelectedOptionCompetition] = useState(optionContests[0])
    const [step, setStep] = useState("")
    const [dataExam1, setDataExam1] = useState([])
    const [dataExam2, setDataExam2] = useState([])
    const [imgExam2, setImgExam2] = useState("")
    const fetchCompetitionList = async () => {
        try {
            const response = await axiosInstance.get(`/competition`);
            const newOptions = response.data.map((competition) => ({
                value: competition.id.toString(),
                label: competition.name,
            }));
            console.log(newOptions);
            setCompetitionList([...optionCompetitions, ...newOptions])
            console.log(optionCompetitions);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchCompetitionById = async () => {
        try {
            const response = await axiosInstance.get(`/competition/${selectedOptionCompetition}`);
            const data = response.data;
            setDataExam1(data.courses)
            setDataExam2(data.secondPhaseQuestions)
            setImgExam2(data.secondPhaseImage)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchCompetitionList()
    }, [])


    const handleSelectChangeCompetition = (selectedOptionCompetition) => {
        setSelectedOptionCompetition(selectedOptionCompetition)
        console.log("selectedOptionCompetition: ", selectedOptionCompetition);
    }
    const handleSelectChange = (selectedOptionContest) => {
        setSelectedOptionContest(selectedOptionContest);
        console.log("selectedOptionContest", selectedOptionContest);
    }

    const handleSearch = () => {
        fetchCompetitionById();
        if (selectedOptionContest == 0 || selectedOptionContest.value == 0) {
            setStep("");
        } else
            if (selectedOptionContest == 1) {
                setStep("exam1");
            } else {
                setStep('exam2')
            }
        console.log("dataExam1", dataExam1);
        console.log("dataExam2", dataExam2);
    }
    return (
        <Space direction='vertical'>
            <Space className='question-manage-container' direction='horizontal'>
                <Select
                    style={{
                        width: 120,
                    }}
                    defaultValue={selectedOptionCompetition[0]}
                    options={competitionList}
                    value={selectedOptionCompetition}
                    onChange={handleSelectChangeCompetition}
                />
                <Select
                    style={{

                    }}
                    defaultValue={optionContests[0]}
                    options={optionContests}
                    value={selectedOptionContest}
                    onChange={handleSelectChange}
                />
                <Button
                    disabled={(selectedOptionCompetition == 0
                        || selectedOptionCompetition.value == 0)
                        || (selectedOptionContest == 0 || selectedOptionContest.value == 0)
                    } type='primary' onClick={handleSearch}>Search</Button>
            </Space>
            <Space className='data-downloaded'>
                {
                    step === 'exam1' ? 
                    <Exam1Manage selectedOptionCompetition={selectedOptionCompetition} dataExam1={dataExam1} /> : step === 'exam2' ? 
                    <Exam2Manage selectedOptionCompetition={selectedOptionCompetition} dataExam2={dataExam2} imgExam2={imgExam2} /> : null}
            </Space>
        </Space>
    )
}

export default QuestionManage