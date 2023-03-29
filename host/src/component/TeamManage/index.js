import React, { useState, useEffect } from 'react'
import { Space, Button, Select, Modal, Input,Card } from 'antd'
import axiosInstance from '../../importAxios'
import SockJS from 'sockjs-client';

const options = [
    { value: '0', label: 'Chọn cuộc thi' },
]
const TeamManage = () => {

    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [competitionList, setCompetitionList] = useState([])
    const [teamList, setTeamList] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("")

    const fetchCompetitionList = async () => {
        try {
            const response = await axiosInstance.get(`/competition`);
            const newOptions = response.data.map((competition) => ({
                value: competition.id.toString(),
                label: competition.name,
            }));
            setCompetitionList([...options, ...newOptions])
        } catch (error) {
            console.error(error);
        }
    }


    const fetchTeamList = async (selectedOption) => {
        try {
            const response = await axiosInstance.get(`/team?competitionId=${selectedOption}`);
            await setTeamList(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const addNewTeam = async (name, id ) => {
        const dataTeam = {
            competitionId: id,
            name: name,
            logoLink: "",
        }
        axiosInstance.post(`/team?competitionId=${id}`,  dataTeam)
            .then(response => {
                const data = response.data;
                const newTeamList = [...teamList];
                newTeamList.push(data);
                setTeamList(newTeamList)
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        fetchCompetitionList()
        fetchTeamList();
    }, [teamList]);

    useEffect(() => {
        var socket = new SockJS('http://14.225.192.174:8111/gs-guide-websocket');
    },[])
    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        fetchTeamList(selectedOption)
    }

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        await addNewTeam(name, selectedOption)
        await fetchTeamList(selectedOption);
        setName("")
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
        <Space className='team-mamage-container' direction='vertical'>
            <Select
                style={{
                    width: 120,
                }}
                defaultValue={options[0]}
                options={competitionList}
                value={selectedOption}
                onChange={handleSelectChange}
            />

            <Button onClick={showModal}>Tạo đội thi</Button>

            <Space className='list-team' direction='vertical'>
                {teamList.map((team) => (
                    <Space >
                        <Card style={{fontSize: '30px'}}>{team.name}</Card>
                    </Space>
                ))}
            </Space>
            <Modal title="Nhập tên cuộc thi" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Modal>
        </Space>
    )
}

export default TeamManage