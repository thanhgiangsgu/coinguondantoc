import { Space, Tabs, Button } from 'antd'
import React from 'react'
import CompetitionManage from '../CompetitionManage';
import QuestionManage from '../QuestionManage';
import TeamManage from '../TeamManage';



const Admin = ({setStep, teamList, setTeamList}) => {

  const item = new Array(3);
item[0] = {
  label: `Quản lý đội thi`,
  key: 1,
  children: <TeamManage />,
  style: 1 === 0 ? { height: 200 } : undefined,
}
item[1] = {
  label: `Quản lý cuộc thi`,
  key: 2,
  children: <CompetitionManage teamList={teamList} setTeamList={setTeamList} />,
  style: 2 === 0 ? { height: 200 } : undefined,
}
item[2] = {
  label: `Quản lý câu hỏi`,
  key: 3,
  children: <QuestionManage />,
  style: 3 === 0 ? { height: 200 } : undefined,
}
  return (
    <>
    <Tabs defaultActiveKey="1"  items={item}  />;
    <Button onClick={() => setStep('homepage')} style={{position: 'absolute', bottom: 0, right: '0'}}>Trở về trang chủ</Button>
    </>
  )
  
}

export default Admin