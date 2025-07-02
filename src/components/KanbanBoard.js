// src/components/KanbanBoard.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const BoardContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  min-height: 70vh;
  overflow-x: auto;
`;

const Column = styled.div`
  flex: 1;
  min-width: 300px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  ${props => props.isDragOver && `
    background: #f8fafc;
    border-color: #3b82f6;
  `}
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
`;

const ColumnTitle = styled.h3`
  margin: 0;
  color: #1e293b;
  font-size: 1.2rem;
  font-weight: 600;
`;

const TaskCount = styled.span`
  background: #3b82f6;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 200px;
`;

const TaskCardClickHint = styled.div`
  font-size: 0.7rem;
  color: #64748b;
  opacity: 0;
  transition: opacity 0.2s ease;
  margin-top: 2px;
`;

const TaskCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  ${props => props.isFixed && `
    height: 140px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `}
  
  ${props => props.isDragging && `
    opacity: 0.5;
    transform: rotate(2deg);
  `}
  
  &:hover {
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
    border-color: #3b82f6;
    
    ${TaskCardClickHint} {
      opacity: 1;
    }
  }
  
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
`;

const DragHandle = styled.div`
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1rem;
  cursor: grab;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #64748b;
    background: #f1f5f9;
  }
  
  &:active {
    cursor: grabbing;
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  margin-left: 20px;
`;

const TaskTitle = styled.h4`
  margin: 0;
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  flex: 1;
  margin-right: 10px;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${TaskCard}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? '#ef4444' : '#3b82f6'};
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.danger ? '#dc2626' : '#2563eb'};
    transform: scale(1.05);
  }
`;

const ArchiveButton = styled(ActionButton)`
  background: #f59e0b;
  
  &:hover {
    background: #d97706;
  }
`;

const TaskDescription = styled.p`
  margin: 8px 0;
  margin-left: 20px;
  color: #475569;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  margin-left: 20px;
`;

const PriorityBadge = styled.span`
  background: ${props => {
    switch (props.priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  }};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
`;

const AssignedTo = styled.span`
  color: #64748b;
  font-size: 0.8rem;
  font-style: italic;
`;

const AddTaskButton = styled.button`
  width: 100%;
  background: #f8fafc;
  color: #64748b;
  border: 2px dashed #cbd5e1;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f1f5f9;
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const DropZone = styled.div`
  min-height: 40px;
  border-radius: 6px;
  border: ${props => props.isDragOver ? '2px dashed #3b82f6' : '2px dashed transparent'};
  background: ${props => props.isDragOver ? '#f0f9ff' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isDragOver ? '#3b82f6' : 'transparent'};
  font-size: 0.85rem;
  transition: all 0.2s ease;
  margin: 8px 0;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 45%;
  max-width: 90vw;
  color: #1e293b;
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;
  border: 2px solid #3b82f6;
`;

const ModalHeader = styled.h3`
  margin: 0 0 20px 0;
  color: #3b82f6;
  font-size: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 500;
`;

const Input = styled.input`
  width: 94%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #1e293b;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const TextArea = styled.textarea`
  width: 94%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #1e293b;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #1e293b;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  ${props => props.primary ? `
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  ` : `
    background: #6b7280;
    color: white;
    
    &:hover {
      background: #4b5563;
    }
  `}
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
  color: #64748b;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: #64748b;
  font-style: italic;
`;

const EmptyColumn = styled.div`
  text-align: center;
  padding: 20px;
  color: #64748b;
  font-style: italic;
`;

const TaskDetailOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const TaskDetailContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const TaskDetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 12px 12px 0 0;
`;

const TaskDetailTitle = styled.h2`
  margin: 0;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
`;

const TaskDetailCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const TaskDetailBody = styled.div`
  padding: 24px;
`;

const TaskDetailSection = styled.div`
  margin-bottom: 24px;
`;

const TaskDetailSectionTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 1.1rem;
  font-weight: 600;
`;

const TaskDetailDescription = styled.p`
  margin: 0;
  color: #374151;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const TaskDetailMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const TaskDetailMetaItem = styled.div`
  display: flex;
  align-items: center;
  color: #374151;
  font-size: 0.95rem;
  
  strong {
    color: #1e293b;
    margin-right: 8px;
    min-width: 80px;
  }
`;

const TaskDetailActions = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
`;

const SearchInput = styled.input`
  padding: 8px 15px;
  border-radius: 20px;
  border: 1px solid #d1d5db;
  background: white;
  color: #1e293b;
  width: 100%;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  padding-right: 35px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #6b7280;
  }
`;

const KanbanBoard = ({ board, onTaskUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [users, setUsers] = useState([]);
  const [, setLoadingUsers] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [showArchivedModal, setShowArchivedModal] = useState(false);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: '',
    priority: 'Medium',
    assignedTo: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const validateTitle = (title) => {
    const wordCount = title.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (!title.trim()) {
      return 'Task title is required';
    }
    
    if (wordCount > 100) {
      return 'Title must be 100 words or less';
    }
    
    const existingTasks = editingTask ? 
      tasks.filter(task => task.id !== editingTask.id) : 
      tasks;
    
    const isDuplicate = existingTasks.some(task => 
      task.title.toLowerCase().trim() === title.toLowerCase().trim()
    );
    
    if (isDuplicate) {
      return 'A task with this title already exists';
    }
    
    return null;
  };

  const validateDescription = (description) => {
    if (!description.trim()) {
      return null;
    }
    
    const wordCount = description.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (wordCount > 1000) {
      return 'Description must be 1000 words or less';
    }
    
    return null;
  };

  const getWordCount = (text) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const filterTasks = (tasks, term) => {
    if (!term) return tasks;
    const lowerTerm = term.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowerTerm) || 
      (task.description && task.description.toLowerCase().includes(lowerTerm)) ||
      (task.assignedTo && task.assignedTo.toLowerCase().includes(lowerTerm))
    );
  };

  const handleTaskCardClick = (task, e) => {
    if (e.target.closest('.task-actions') || e.target.closest('.drag-handle')) {
      return;
    }
    
    setExpandedTask(expandedTask?.id === task.id ? null : task);
  };

  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8080/api/v1/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      } else {
        console.error('Failed to fetch current user profile');
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          setCurrentUser({ role: tokenPayload.role || 'USER' });
        } catch (e) {
          console.error('Failed to decode token, defaulting to USER role');
          setCurrentUser({ role: 'USER' });
        }
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setCurrentUser({ role: 'USER' });
    }
  }, []);

  const isAdmin = () => {
    return currentUser?.role === 'ADMIN';
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8080/api/v1/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const nonAdminUsers = data.filter(user => user.role !== 'ADMIN');
        setUsers(nonAdminUsers);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

const fetchTasks = useCallback(async () => {
  if (!board) return;
  
  try {
    const token = localStorage.getItem('auth_token');
    // Add query parameter to fetch only non-archived tasks
    const response = await fetch(`http://localhost:8081/api/v1/tasks/board/${board.id}?archived=false`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      // Additional frontend filter as backup in case backend doesn't filter
      const nonArchivedTasks = data.filter(task => !task.archived);
      setTasks(nonArchivedTasks);
    } else {
      console.error('Failed to fetch tasks');
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
  } finally {
    setLoading(false);
  }
}, [board]);

  const fetchArchivedTasks = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8081/api/v1/tasks/archived', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setArchivedTasks(data);
      }
    } catch (error) {
      console.error('Error fetching archived tasks:', error);
    }
  };

  const handleRestoreTask = async (taskId) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8081/api/v1/tasks/${taskId}/restore`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchTasks();
        fetchArchivedTasks();
        if (onTaskUpdate) onTaskUpdate();
        alert('Task restored successfully!');
      } else {
        alert('Failed to restore task');
      }
    } catch (error) {
      console.error('Error restoring task:', error);
      alert('Error restoring task');
    }
  };

  useEffect(() => {
    if (board) {
      fetchCurrentUser();
      fetchTasks();
      fetchUsers();
    }
  }, [board, fetchTasks, fetchUsers, fetchCurrentUser]);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('text/plain', task.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, column) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(column);
  };

  const handleDragLeave = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTask || draggedTask.status === targetStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8081/api/v1/tasks/${draggedTask.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...draggedTask,
          status: targetStatus
        })
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === draggedTask.id ? updatedTask : task
          )
        );
        if (onTaskUpdate) onTaskUpdate();
      } else {
        console.error('Failed to update task status');
        alert('Failed to move task. Please try again.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error moving task. Please try again.');
    }

    setDraggedTask(null);
  };

  const handleDeleteTask = async (taskId) => {
    if (!isAdmin()) {
      alert('You do not have permission to archive tasks.');
      return;
    }

    if (!window.confirm('Are you sure you want to archive this task? You can restore it later from the archived tasks view.')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8081/api/v1/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        if (expandedTask?.id === taskId) {
          setExpandedTask(null);
        }
        if (onTaskUpdate) onTaskUpdate();
        alert('Task archived successfully. You can restore it from the archived tasks view.');
      } else {
        alert('Failed to archive task. Please try again.');
      }
    } catch (error) {
      console.error('Error archiving task:', error);
      alert('Error archiving task. Please try again.');
    }
  };

  const handleEditTask = (task) => {
    if (!isAdmin()) {
      alert('You do not have permission to edit tasks.');
      return;
    }

    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleAddTask = (status) => {
    if (!isAdmin()) {
      alert('You do not have permission to create new tasks.');
      return;
    }

    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      status: status,
      priority: 'Medium',
      assignedTo: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAdmin()) {
      alert('You do not have permission to modify tasks.');
      return;
    }
    
    const titleError = validateTitle(taskForm.title);
    const descriptionError = validateDescription(taskForm.description);
    
    const errors = {};
    if (titleError) errors.title = titleError;
    if (descriptionError) errors.description = descriptionError;
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const url = editingTask 
        ? `http://localhost:8081/api/v1/tasks/${editingTask.id}`
        : 'http://localhost:8081/api/v1/tasks';
      
      const method = editingTask ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...taskForm,
          boardId: board.id
        })
      });

      if (response.ok) {
        const updatedTask = await response.json();
        
        if (editingTask) {
          setTasks(prevTasks => 
            prevTasks.map(task => 
              task.id === editingTask.id ? updatedTask : task
            )
          );
          if (expandedTask?.id === editingTask.id) {
            setExpandedTask(updatedTask);
          }
        } else {
          setTasks(prevTasks => [...prevTasks, updatedTask]);
        }
        
        if (onTaskUpdate) onTaskUpdate();
        setShowModal(false);
        setEditingTask(null);
        setTaskForm({
          title: '',
          description: '',
          status: '',
          priority: 'Medium',
          assignedTo: ''
        });
        setFormErrors({});
      } else {
        alert('Failed to save task. Please try again.');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error saving task. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      status: '',
      priority: 'Medium',
      assignedTo: ''
    });
    setFormErrors({});
  };

  const TaskDetailModal = ({ task, onClose }) => {
    if (!task) return null;

    return (
      <TaskDetailOverlay onClick={onClose}>
        <TaskDetailContent onClick={(e) => e.stopPropagation()}>
          <TaskDetailHeader>
            <TaskDetailTitle>{task.title}</TaskDetailTitle>
            <TaskDetailCloseButton onClick={onClose}>×</TaskDetailCloseButton>
          </TaskDetailHeader>
          
          <TaskDetailBody>
            {task.description && (
              <TaskDetailSection>
                <TaskDetailSectionTitle>Description</TaskDetailSectionTitle>
                <TaskDetailDescription>{task.description}</TaskDetailDescription>
              </TaskDetailSection>
            )}
            
            <TaskDetailMeta>
              <TaskDetailMetaItem>
                <strong>Status:</strong> {task.status}
              </TaskDetailMetaItem>
              <TaskDetailMetaItem>
                <strong>Priority:</strong> 
                <PriorityBadge priority={task.priority} style={{ marginLeft: '8px' }}>
                  {task.priority}
                </PriorityBadge>
              </TaskDetailMetaItem>
              {task.assignedTo && (
                <TaskDetailMetaItem>
                  <strong>Assigned to:</strong> @{task.assignedTo}
                </TaskDetailMetaItem>
              )}
              {task.createdAt && (
                <TaskDetailMetaItem>
                  <strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}
                </TaskDetailMetaItem>
              )}
              {task.updatedAt && (
                <TaskDetailMetaItem>
                  <strong>Updated:</strong> {new Date(task.updatedAt).toLocaleString()}
                </TaskDetailMetaItem>
              )}
            </TaskDetailMeta>
            
            {isAdmin() && (
              <TaskDetailActions>
                <ActionButton onClick={() => {
                  onClose();
                  handleEditTask(task);
                }}>
                  Edit Task
                </ActionButton>
                <ActionButton 
                  danger 
                  onClick={() => {
                    onClose();
                    handleDeleteTask(task.id);
                  }}
                >
                  Delete Task
                </ActionButton>
              </TaskDetailActions>
            )}
          </TaskDetailBody>
        </TaskDetailContent>
      </TaskDetailOverlay>
    );
  };

  const ArchivedTasksModal = () => (
    <Modal onClick={() => setShowArchivedModal(false)}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>Archived Tasks</ModalHeader>
        
        {archivedTasks.length === 0 ? (
          <EmptyState>No archived tasks found</EmptyState>
        ) : (
          <TaskList>
            {archivedTasks.map(task => (
              <TaskCard key={task.id} isFixed>
                <TaskHeader>
                  <TaskTitle>{task.title}</TaskTitle>
                  <TaskActions>
                    <ArchiveButton onClick={() => handleRestoreTask(task.id)}>
                      Restore
                    </ArchiveButton>
                  </TaskActions>
                </TaskHeader>
                
                {task.description && (
                  <TaskDescription>{truncateText(task.description, 80)}</TaskDescription>
                )}
                
                <TaskMeta>
                  <PriorityBadge priority={task.priority}>
                    {task.priority}
                  </PriorityBadge>
                  <AssignedTo>@{task.assignedTo}</AssignedTo>
                </TaskMeta>
              </TaskCard>
            ))}
          </TaskList>
        )}
        
        <ModalActions>
          <Button onClick={() => setShowArchivedModal(false)}>
            Close
          </Button>
        </ModalActions>
      </ModalContent>
    </Modal>
  );

  if (loading) {
    return (
      <LoadingContainer>
        <h3>Loading board tasks...</h3>
      </LoadingContainer>
    );
  }

  const getTasksByStatus = (status) => {
    const statusTasks = tasks.filter(task => task.status === status);
    return filterTasks(statusTasks, searchTerm);
  };

  return (
    <>
      <SearchContainer>
        <SearchWrapper>
          <SearchInput
            type="text"
            placeholder="Search tasks by title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <ClearButton onClick={() => setSearchTerm('')}>
              ×
            </ClearButton>
          )}
        </SearchWrapper>
        {isAdmin() && (
          <ArchiveButton 
            onClick={() => {
              fetchArchivedTasks();
              setShowArchivedModal(true);
            }}
          >
            View Archived Tasks
          </ArchiveButton>
        )}
      </SearchContainer>
      <BoardContainer>
        {board.columns.map(column => {
          const columnTasks = getTasksByStatus(column);
          const isDragOver = dragOverColumn === column;
          
          return (
            <Column 
              key={column}
              isDragOver={isDragOver}
              onDragOver={(e) => handleDragOver(e, column)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column)}
            >
              <ColumnHeader>
                <ColumnTitle>{column}</ColumnTitle>
                <TaskCount>{columnTasks.length}</TaskCount>
              </ColumnHeader>
              
              <TaskList>
                {isDragOver && (
                  <DropZone isDragOver={true}>
                    Drop task here
                  </DropZone>
                )}
                
                {columnTasks.length === 0 && !isDragOver ? (
                  <EmptyColumn>No tasks in this column</EmptyColumn>
                ) : (
                  columnTasks.map(task => (
                    <TaskCard 
                      key={task.id}
                      draggable
                      isDragging={draggedTask?.id === task.id}
                      isFixed={true}
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => handleTaskCardClick(task, e)}
                      style={{ cursor: 'pointer' }}
                    >
                      <DragHandle className="drag-handle">⋮⋮</DragHandle>
                      <TaskHeader>
                        <TaskTitle>{truncateText(task.title, 50)}</TaskTitle>
                        {isAdmin() && (
                          <TaskActions className="task-actions">
                            <ActionButton onClick={(e) => {
                              e.stopPropagation();
                              handleEditTask(task);
                            }}>
                              Edit
                            </ActionButton>
                            <ActionButton 
                              danger 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task.id);
                              }}
                            >
                              Delete
                            </ActionButton>
                          </TaskActions>
                        )}
                      </TaskHeader>
                      
                      {task.description && (
                        <TaskDescription>{truncateText(task.description, 80)}</TaskDescription>
                      )}
                      
                      <TaskMeta>
                        <PriorityBadge priority={task.priority}>
                          {task.priority}
                        </PriorityBadge>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          {task.assignedTo && (
                            <AssignedTo>@{task.assignedTo}</AssignedTo>
                          )}
                          <TaskCardClickHint>Click to view details</TaskCardClickHint>
                          {task.createdAt && (
                            <AssignedTo style={{ fontStyle: 'normal', fontSize: '0.75rem', opacity: 0.8 }}>
                              📅 Created: {new Date(task.createdAt).toLocaleDateString()}
                            </AssignedTo>
                          )}
                          {task.updatedAt && (
                            <AssignedTo style={{ fontStyle: 'normal', fontSize: '0.75rem', opacity: 0.8, marginTop: '-2px' }}>
                              ✏ Updated: {new Date(task.updatedAt).toLocaleDateString()}
                            </AssignedTo>
                          )}
                        </div>
                      </TaskMeta>
                    </TaskCard>
                  ))
                )}
                
                {isAdmin() && column === 'To Do' && (
                  <AddTaskButton onClick={() => handleAddTask(column)}>
                    ✨ Add New Task
                  </AddTaskButton>
                )}
              </TaskList>
            </Column>
          );
        })}
      </BoardContainer>

      <TaskDetailModal 
        task={expandedTask} 
        onClose={() => setExpandedTask(null)} 
      />

      {showArchivedModal && <ArchivedTasksModal />}

      {showModal && isAdmin() && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </ModalHeader>
            
            <form onSubmit={handleFormSubmit}>
              <FormGroup>
                <Label>Task Title *</Label>
                <Input
                  type="text"
                  name="title"
                  value={taskForm.title}
                  onChange={handleInputChange}
                  placeholder="Enter task title"
                  required
                  style={{
                    borderColor: formErrors.title ? '#ff6b6b' : undefined
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '4px',
                  fontSize: '12px'
                }}>
                  {formErrors.title && (
                    <span style={{ color: '#ff6b6b' }}>
                      {formErrors.title}
                    </span>
                  )}
                  <span style={{ 
                    color: getWordCount(taskForm.title) > 100 ? '#ff6b6b' : '#666',
                    marginLeft: 'auto'
                  }}>
                    {getWordCount(taskForm.title)}/100 words
                  </span>
                </div>
              </FormGroup>

              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  name="description"
                  value={taskForm.description}
                  onChange={handleInputChange}
                  placeholder="Enter task description"
                  style={{
                    borderColor: formErrors.description ? '#ff6b6b' : undefined
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '4px',
                  fontSize: '12px'
                }}>
                  {formErrors.description && (
                    <span style={{ color: '#ff6b6b' }}>
                      {formErrors.description}
                    </span>
                  )}
                  <span style={{ 
                    color: getWordCount(taskForm.description) > 1000 ? '#ff6b6b' : '#666',
                    marginLeft: 'auto'
                  }}>
                    {getWordCount(taskForm.description)}/1000 words
                  </span>
                </div>
              </FormGroup>

              <FormGroup>
                <Label>Priority</Label>
                <Select
                  name="priority"
                  value={taskForm.priority}
                  onChange={handleInputChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Assigned To</Label>
                <Select
                  name="assignedTo"
                  value={taskForm.assignedTo}
                  onChange={handleInputChange}
                >
                  <option value="">Select users</option>
                  {users
                    .filter(user => user.role !== 'ADMIN')
                    .map(user => (
                      <option key={user.userId} value={user.username}>
                        {user.username}
                      </option>
                    ))}
                </Select>
              </FormGroup>

              <ModalActions>
                <Button type="button" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" primary>
                  {editingTask ? 'Update Task' : 'Create Task'}
                </Button>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default KanbanBoard;