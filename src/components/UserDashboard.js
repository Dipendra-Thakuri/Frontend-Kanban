// src/components/UserDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import KanbanBoard from './KanbanBoard';
import { KANBAN_API_URL } from './config';

const DashboardContainer = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 89vh;
  color: #1e293b;
`;

const TabContainer = styled.div`
  display: flex;
  background: white;
  border-bottom: 2px solid #3b82f6;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button`
  background: ${props => props.active ? '#3b82f6' : 'transparent'};
  color: ${props => props.active ? 'white' : '#64748b'};
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f1f5f9'};
    color: ${props => props.active ? 'white' : '#3b82f6'};
  }
`;

const Content = styled.div`
  padding: 20px;
`;

const BoardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const BoardCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
    border-color: #3b82f6;
  }
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const BoardTitle = styled.h3`
  margin: 0;
  color: #3b82f6;
  font-size: 1.2rem;
  font-weight: 600;
`;

const BoardActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? '#ef4444' : '#10b981'};
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.danger ? '#dc2626' : '#059669'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.danger ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'};
  }
`;

const RefreshButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const BoardDescription = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const BoardStats = styled.div`
  margin-top: 10px;
  font-size: 0.8rem;
  color: #64748b;
`;

const CompletionSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const CompletionText = styled.span`
  font-size: 1.1rem;
  color: #1e293b;
  font-weight: 500;
`;

const CompletionBar = styled.div`
  flex: 1;
  height: 10px;
  background: #e2e8f0;
  border-radius: 5px;
  overflow: hidden;
`;

const CompletionFill = styled.div`
  height: 100%;
  background: #10b981;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const CompletionPercentage = styled.span`
  font-weight: 600;
  color: #10b981;
  font-size: 1.2rem;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
  
  h3 {
    color: #64748b;
    font-weight: 400;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #64748b;
  
  h3 {
    color: #1e293b;
    margin-bottom: 10px;
    font-weight: 600;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const LastRefresh = styled.span`
  font-size: 0.8rem;
  color: #64748b;
`;

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('boards');
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [completionRate, setCompletionRate] = useState(0);
  const [boardStats, setBoardStats] = useState({});
  const [lastRefresh, setLastRefresh] = useState(null);

  // Memoize fetchBoards to prevent unnecessary re-renders
  const fetchBoards = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${KANBAN_API_URL}/api/v1/boards`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBoards(data);
        setLastRefresh(new Date().toLocaleTimeString());
        
        if (data.length > 0) {
          await calculateOverallCompletion(data);
          await fetchBoardStats(data);
        } else {
          setCompletionRate(0);
          setBoardStats({});
        }
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  }, []);

  // Auto-refresh every 30 seconds to catch new assigned tasks
  useEffect(() => {
    fetchBoards();
    
    const interval = setInterval(() => {
      fetchBoards();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchBoards]);

  // Manual refresh function
  const handleManualRefresh = () => {
    fetchBoards(true);
  };

  const calculateOverallCompletion = async (boardList) => {
    try {
      const token = localStorage.getItem('auth_token');
      let totalTasks = 0;
      let completedTasks = 0;

      for (const board of boardList) {
        const response = await fetch(`${KANBAN_API_URL}/api/v1/tasks/board/${board.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const tasks = await response.json();
          totalTasks += tasks.length;
          completedTasks += tasks.filter(task => 
            task.status === 'Completed' || task.status === 'Done'
          ).length;
        }
      }

      const rate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      setCompletionRate(rate);
    } catch (error) {
      console.error('Error calculating completion:', error);
    }
  };

  const fetchBoardStats = async (boardList) => {
    const stats = {};
    const token = localStorage.getItem('auth_token');

    for (const board of boardList) {
      try {
        const response = await fetch(`${KANBAN_API_URL}/api/v1/tasks/board/${board.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const tasks = await response.json();
          const completedTasks = tasks.filter(task => 
            task.status === 'Completed' || task.status === 'Done'
          ).length;
          
          stats[board.id] = {
            total: tasks.length,
            completed: completedTasks,
            percentage: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0
          };
        }
      } catch (error) {
        console.error(`Error fetching stats for board ${board.id}:`, error);
      }
    }

    setBoardStats(stats);
  };

  const selectBoard = (board) => {
    setSelectedBoard(board);
    setActiveTab('kanban');
  };

  // Callback function to refresh data when tasks are updated
  const handleTaskUpdate = () => {
    fetchBoards(true);
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingContainer>
          <h3>Loading your boards...</h3>
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <TabContainer>
        <Tab active={activeTab === 'boards'} onClick={() => setActiveTab('boards')}>
          My Boards
        </Tab>
        <Tab active={activeTab === 'kanban'} onClick={() => setActiveTab('kanban')}>
          Kanban View
        </Tab>
      </TabContainer>

      <Content>
        {activeTab === 'boards' && (
          <>
            <HeaderSection>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RefreshButton onClick={handleManualRefresh} disabled={refreshing}>
                  {refreshing ? 'Refreshing...' : '🔄 Refresh'}
                </RefreshButton>
              </div>
              {lastRefresh && (
                <LastRefresh>Last updated: {lastRefresh}</LastRefresh>
              )}
            </HeaderSection>

            <CompletionSection>
              <CompletionText>Overall Progress:</CompletionText>
              <CompletionBar>
                <CompletionFill percentage={completionRate} />
              </CompletionBar>
              <CompletionPercentage>{completionRate}%</CompletionPercentage>
            </CompletionSection>

            {boards.length === 0 ? (
              <EmptyState>
                <h3>No boards yet</h3>
              </EmptyState>
            ) : (
              <BoardsGrid>
                {boards.map(board => (
                  <BoardCard key={board.id}>
                    <BoardHeader>
                      <BoardTitle>{board.name}</BoardTitle>
                      <BoardActions>
                        <ActionButton onClick={() => selectBoard(board)}>Open</ActionButton>
                      </BoardActions>
                    </BoardHeader>
                    <BoardDescription>{board.description}</BoardDescription>
                    {boardStats[board.id] && (
                      <BoardStats>
                        {boardStats[board.id].completed}/{boardStats[board.id].total} tasks completed 
                        ({boardStats[board.id].percentage}%)
                      </BoardStats>
                    )}
                  </BoardCard>
                ))}
              </BoardsGrid>
            )}
          </>
        )}

        {activeTab === 'kanban' && selectedBoard && (
          <KanbanBoard 
            board={selectedBoard} 
            onTaskUpdate={handleTaskUpdate}
          />
        )}

        {activeTab === 'kanban' && !selectedBoard && (
          <EmptyState>
            <h3>No board selected</h3>
            <p>Select a board from the "My Boards" tab to view it here.</p>
          </EmptyState>
        )}
      </Content>
    </DashboardContainer>
  );
};

export default UserDashboard;