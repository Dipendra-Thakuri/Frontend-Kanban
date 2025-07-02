// src/pages/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 89vh;
  color: #1e293b;
`;

const MainContent = styled.div`
  display: flex;
  max-width: 1800px;
  margin: 0 auto;
  padding: 20px;
  gap: 30px;
`;

const Sidebar = styled.div`
  background: #1e293b;
  width: 280px;
  border-radius: 15px;
  padding: 30px 0;
  color: white;
  height: 100%;
`;

const UserSection = styled.div`
  text-align: center;
  padding: 0 30px 40px;
  border-bottom: 1px solid #334155;
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
  font-weight: 700;
  color: white;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 5px 0;
  color: white;
`;

const UserEmail = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0;
`;

const NavMenu = styled.nav`
  padding: 30px 0;
`;

const NavItem = styled.div`
  padding: 15px 30px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #94a3b8;
  font-weight: 500;
  
  &:hover {
    background: #334155;
    color: white;
  }
  
  &.active {
    background: #3b82f6;
    color: white;
  }
`;

const NavIcon = styled.span`
  font-size: 1.2rem;
  width: 20px;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DashboardTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const TopStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 25px;
`;

const TopStatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const StatLabel = styled.span`
  color: black;
  font-size: 1.2rem;
  font-weight: 900;
`;

const StatIcon = styled.div`
  color: ${props => props.color || '#3b82f6'};
  font-size: 1.2rem;
`;

const StatValue = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const StatSubValue = styled.div`
  font-size: 1.1rem;
  color: ${props => props.color || '#64748b'};
  font-weight: 600;
`;

const ActionButton = styled.button`
  background: #f59e0b;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
  
  &:hover {
    background: #d97706;
    transform: translateY(-2px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  flex-direction: column;
  gap: 20px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.h2`
  color: #64748b;
  font-weight: 500;
  font-size: 1.2rem;
  margin: 0;
`;

// Profile Section Styles
const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
`;

const ProfileCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  height: fit-content;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 15px;
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 3rem;
  font-weight: 700;
  color: white;
`;

const ProfileName = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 10px 0;
`;

const ProfileRole = styled.div`
  background: ${props => props.role === 'ADMIN' ? '#dc2626' : '#059669'};
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 20px;
  text-transform: uppercase;
`;

const ProfileDetailsCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 25px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e2e8f0;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
`;

const DetailValue = styled.span`
  color: #1e293b;
  font-weight: 500;
  font-size: 0.95rem;
`;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [stats, setStats] = useState({
    totalBoards: 0,
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);

  // Memoize fetchStats to prevent unnecessary re-renders
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Fetch boards
      const boardsResponse = await fetch('http://localhost:8081/api/v1/boards', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (boardsResponse.ok) {
        const boards = await boardsResponse.json();
        let totalTasks = 0;
        let completedTasks = 0;

        // Fetch tasks for each board
        for (const board of boards) {
          const tasksResponse = await fetch(`http://localhost:8081/api/v1/tasks/board/${board.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (tasksResponse.ok) {
            const tasks = await tasksResponse.json();
            const nonArchivedTasks = tasks.filter(task => !task.archived);
            totalTasks += nonArchivedTasks.length;
            completedTasks += nonArchivedTasks.filter(task =>
              task.status === 'Completed' || task.status === 'Done'
            ).length;
          }
        }

        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        setStats({
          totalBoards: boards.length,
          totalTasks,
          completedTasks,
          completionRate
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArchivedTasks = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch('http://localhost:8081/api/v1/tasks/archived', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      setArchivedTasks(data);
    } else {
      console.error('Failed to fetch archived tasks');
    }
  } catch (error) {
    console.error('Error fetching archived tasks:', error);
  }
};

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchStats();
    // fetchProfileData();
    fetchArchivedTasks();
  }, [user, navigate, fetchStats]);

  const goToBoard = () => {
    navigate('/kanban');
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <>
        <DashboardContainer>
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading your dashboard...</LoadingText>
          </LoadingContainer>
        </DashboardContainer>
      </>
    );
  }

  const getUserInitials = () => {
    if (user?.username) {
      const name = user?.username;
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const renderProfileView = () => (
  <ProfileContainer>
    <ProfileCard>
      <ProfileHeader>
        <ProfileAvatar>{getUserInitials()}</ProfileAvatar>
        <ProfileName>{user?.username || user?.name || 'User'}</ProfileName>
        <ProfileRole role={user?.role || 'USER'}>
          {user?.role || 'USER'}
        </ProfileRole>
      </ProfileHeader>
    </ProfileCard>

    <ProfileDetailsCard>
      <SectionTitle>Personal Information</SectionTitle>
      
      <DetailRow>
        <DetailLabel>Username</DetailLabel>
        <DetailValue>{user?.username || 'Not provided'}</DetailValue>
      </DetailRow>
      
      <DetailRow>
        <DetailLabel>Email Address</DetailLabel>
        <DetailValue>{user?.email || 'Not provided'}</DetailValue>
      </DetailRow>
      
      <DetailRow>
        <DetailLabel>Role</DetailLabel>
        <DetailValue>{user?.role || 'USER'}</DetailValue>
      </DetailRow>
      
      <DetailRow>
        <DetailLabel>Account Status</DetailLabel>
        <DetailValue>Active</DetailValue>
      </DetailRow>
    </ProfileDetailsCard>
  </ProfileContainer>
  );

  const renderHomeView = () => (
    <>
      <TopStatsGrid>
        <TopStatCard>
          <StatHeader>
            <StatLabel>Active Boards</StatLabel>
            <StatIcon color="#ef4444">📋</StatIcon>
          </StatHeader>
          <StatValue>{stats.totalBoards}</StatValue>
          <StatSubValue color="#ef4444">Project Boards</StatSubValue>
        </TopStatCard>

        <TopStatCard>
          <StatHeader>
            <StatLabel>Total Tasks</StatLabel>
            <StatIcon color="#3b82f6">📝</StatIcon>
          </StatHeader>
          <StatValue>{stats.totalTasks}</StatValue>
          <StatSubValue color="#3b82f6">All Tasks</StatSubValue>
        </TopStatCard>

        <TopStatCard>
          <StatHeader>
            <StatLabel>Completed</StatLabel>
            <StatIcon color="#10b981">✅</StatIcon>
          </StatHeader>
          <StatValue>{stats.completedTasks}</StatValue>
          <StatSubValue color="#10b981">Finished Tasks</StatSubValue>
        </TopStatCard>

        <TopStatCard>
          <StatHeader>
            <StatLabel>Progress</StatLabel>
            <StatIcon color="#f59e0b">📊</StatIcon>
          </StatHeader>
          <StatValue>{archivedTasks.length}</StatValue>
          <StatSubValue color="#f59e0b">Archived</StatSubValue>
        </TopStatCard>

        <TopStatCard>
          <StatHeader>
            <StatLabel>Completion Rate</StatLabel>
            <StatIcon color="#8b5cf6">📊</StatIcon>
          </StatHeader>
        <StatValue>{stats.completionRate}%</StatValue>
        <StatSubValue color="#8b5cf6">{stats.completedTasks} / {stats.totalTasks} Tasks</StatSubValue>
      </TopStatCard>
      </TopStatsGrid>
    </>
  );

  return (
    <>
      <DashboardContainer>
        <MainContent>
          <Sidebar>
            <UserSection>
              <UserAvatar>{getUserInitials()}</UserAvatar>
              <UserName>{user?.username || user?.name || 'User'}</UserName>
              <UserEmail>{user?.email || 'user@example.com'}</UserEmail>
            </UserSection>
            
            <NavMenu>
              <NavItem 
                className={activeTab === 'home' ? 'active' : ''}
                onClick={() => handleNavClick('home')}
              >
                <NavIcon>🏠</NavIcon>
                Home
              </NavItem>
              <NavItem 
                className={activeTab === 'profile' ? 'active' : ''}
                onClick={() => handleNavClick('profile')}
              >
                <NavIcon>👤</NavIcon>
                Profile
              </NavItem>
          
            </NavMenu>
          </Sidebar>

          <ContentArea>
            <TopBar>
              <DashboardTitle>
                {activeTab === 'home' && 'Project Dashboard'}
                {activeTab === 'profile' && 'User Profile'}
             
              </DashboardTitle>
              <ActionButton style={{ alignSelf: 'flex-start' }} onClick={goToBoard}>
                Open Kanban
              </ActionButton>

            </TopBar>

            {activeTab === 'home' && renderHomeView()}
            {activeTab === 'profile' && renderProfileView()}
          </ContentArea>
        </MainContent>
      </DashboardContainer>
    </>
  );
};

export default Dashboard;