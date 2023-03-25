import React from 'react'
import { Space, Button, Modal, Input } from 'antd'
import { useState, useEffect } from 'react'
import axiosInstance from '../../importAxios'
import './CompetitionManage.css'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs';
const CompetitionManage = ({ stompClient, teamList }) => {
    console.log(teamList);
    const initArr = new Array(100).fill(3);
    const [competitionList, setCompetitionList] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [titleButtonStartCompetition, setTitleButtonStartCompetition] = useState("Bắt đầu")
    const [typeButtonStartCompetition, setTypeButtonStartCompetition] = useState("primary")
    const [selectedCompetition, setSelectedCompetition] = useState(0);
    const [listTeam, setListTeam] = useState([])
    const [isDisableShowListTeam, setIsDisableShowListTeam] = useState(true);
    const [isTeamListModal, setTeamListModal] = useState(false);
    const [listTeamData, setListTeamData] = useState([]);
    const showModalTeamList = () => {
        setIsModalOpen(true);
    };

    const teamListhandleOk = () => {
        setTeamListModal(false);
    };

    const teamListHandleCancel = () => {
        setTeamListModal(false);
    };
    const fetchTeamList = async () => {
        try {
            const response = await axiosInstance.get('/competition');
            const data = response.data;
            setCompetitionList(data)
        } catch (error) {
            console.error(error)
        }
    };

    const addData = async () => {
        axiosInstance.post('/competition', { name })
            .then(response => {
                const data = response.data;
                const newCompetitionList = [...competitionList];
                newCompetitionList.push(data);
                setCompetitionList(newCompetitionList)
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        fetchTeamList()
    },[])

    // useEffect(() => {
    //     fetchTeamList();
    //     // stompClient.subscribe('/topic/host', function (message) {
    //     //     const teamCode = JSON.parse(message.body);
    //     //     console.log(teamCode);
    //     //     setListTeamData(prevListTeamData => [...prevListTeamData, teamCode]);
    //     //     console.log(listTeamData);
    //     // });
    //     if (stompClient) {
            // stompClient.subscribe('/topic/host', function (message) {
            //     const teamCode = JSON.parse(message.body);
            //     console.log(teamCode);
            //     setListTeamData(prevListTeamData => [...prevListTeamData, teamCode]);
            //     console.log(listTeamData);
            // });
    //     }
    // }, [stompClient]);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        await addData();
        await fetchTeamList();
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const startCompetition = async (id) => {
        console.log("join to start");
        axiosInstance.post(`competition/${id}/start`)
            .then(response => {
                const data = response.data;
                console.log(data);
                setListTeam(data.teams)
                setIsDisableShowListTeam(false)
                localStorage.setItem('dataCompetition', JSON.stringify(data));
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleStartCompetition = (id) => {
        if (titleButtonStartCompetition == "Bắt đầu") {
            setSelectedCompetition(id);
            localStorage.setItem("CompetitionId", id);
            setTitleButtonStartCompetition("Hủy")
            startCompetition(id);
            localStorage.setItem("arrExam1", JSON.stringify(initArr))
            localStorage.setItem("arrExam2", JSON.stringify(initArr))
        } else {
            setSelectedCompetition(0)
            setTitleButtonStartCompetition("Bắt đầu")
            localStorage.setItem("CompetitionId", 0);
            setListTeam([]);
            setListTeamData([]);
            localStorage.removeItem('dataCompetition')
            setIsDisableShowListTeam(true)
        }
    }

    const handleShowModalTeamList = () => {
        setTeamListModal(true)
    }



    return (
        <Space direction='vertical' className='competition-mamage-container'>
            <Button onClick={() => setIsModalOpen(true)}>Thêm cuộc thi</Button>
            <Button onClick={handleShowModalTeamList} disabled={isDisableShowListTeam} type='primary'>Xem danh sách đội thi</Button>
            <Space className='competition-list' direction='vertical'>
                {competitionList.map((team) => (
                    <Space className='competition-item'>
                        <h5>{team.name}</h5>
                        <Button disabled={team.id != selectedCompetition && selectedCompetition != 0} onClick={() => handleStartCompetition(team.id)} type={typeButtonStartCompetition}>{titleButtonStartCompetition}</Button>
                    </Space>
                ))}

            </Space>

            <Modal title="Nhập tên cuộc thi" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Input onChange={(e) => setName(e.target.value)} />
            </Modal>

            <Modal title="Basic Modal" open={isTeamListModal} onOk={teamListhandleOk} onCancel={teamListHandleCancel}>
                <Space direction="vertical">
                    <Space direction='vertical'>
                        <h1>List Team</h1>
                        {listTeam.map((item) => {
                            return (
                                <Space direction='horizontal'>
                                    <h3>Team name : {item.name}</h3>
                                    <h3>Team code : {item.teamCode}</h3>
                                </Space>
                            )
                        })}
                    </Space>
                    <Space direction='vertical'>
                        <h1>Team Connected</h1>
                        <Space direction='vertical'>
                            {teamList.map((item) => {
                                return (
                                    <h3>Team name : {item.data.name}</h3>
                                )
                            })}
                        </Space>


                    </Space>
                </Space>
            </Modal>
        </Space>
    )
}

export default CompetitionManage