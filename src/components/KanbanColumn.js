// src/components/KanbanColumn.js
import React from 'react';
import styled from 'styled-components';
import TaskCard from './TaskCard';

const ColumnContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 300px;
  min-height: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const ColumnHeader = styled.div`
  padding: 20px;
  border-bottom: 2px solid ${props => props.color};
  background: ${props => props.color}10;
  border-radius: 12px 12px 0 0;
`;

const ColumnTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TaskCount = styled.span`
  background: ${props => props.color};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
`;

const ColumnContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 400px;
  position: relative;
`;

const DropZone = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.isDragOver ? `${props.color}20` : 'transparent'};
  border: ${props => props.isDragOver ? `2px dashed ${props.color}` : 'none'};
  border-radius: 8px;
  transition: all 0.3s ease;
  pointer-events: ${props => props.isDragOver ? 'none' : 'auto'};
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  font-style: italic;
  margin-top: 50px;
`;

const KanbanColumn = ({ 
  column, 
  tasks, 
  onEditTask, 
  onDeleteTask, 
  onMoveTask, 
  userRole 
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && taskId !== column.id) {
      onMoveTask(parseInt(taskId), column.id);
    }
  };

  const canEditTasks = userRole === 'ADMIN' || userRole === 'admin';

  return (
    <ColumnContainer>
      <ColumnHeader color={column.color}>
        <ColumnTitle>
          {column.title}
          <TaskCount color={column.color}>{tasks.length}</TaskCount>
        </ColumnTitle>
      </ColumnHeader>
      
      <ColumnContent
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <DropZone isDragOver={isDragOver} color={column.color} />
        
        {tasks.length === 0 ? (
          <EmptyMessage>No tasks in {column.title.toLowerCase()}</EmptyMessage>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
              canEdit={canEditTasks}
              columnColor={column.color}
            />
          ))
        )}
      </ColumnContent>
    </ColumnContainer>
  );
};

export default KanbanColumn;