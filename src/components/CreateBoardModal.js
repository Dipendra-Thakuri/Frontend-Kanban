// CreateBoardModal.js - A reusable modal component for creating boards
import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 45%;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;
  border: 2px solid #3b82f6;
  color: #1e293b;
`;

const ModalHeader = styled.h3`
  margin: 0 0 20px 0;
  color: #3b82f6;
  font-size: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
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
  
  &::placeholder {
    color: #9ca3af;
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
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const ColumnsContainer = styled.div`
  margin-bottom: 10px;
`;

const ColumnItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const ColumnInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #1e293b;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const RemoveColumnButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #dc2626;
    transform: scale(1.05);
  }
`;

const AddColumnButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #2563eb;
  }
`;

const ButtonGroup = styled.div`
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
`;

const CancelButton = styled(Button)`
  background: #6b7280;
  color: white;
  
  &:hover {
    background: #4b5563;
  }
`;

const CreateButton = styled(Button)`
  background: #3b82f6;
  color: white;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.9rem;
  margin: 0;
`;

const WordCountContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  font-size: 12px;
`;

const WordCount = styled.span`
  color: ${props => props.isOverLimit ? '#ef4444' : '#666'};
  margin-left: auto;
`;

const CreateBoardModal = ({ isOpen, onClose, onCreateBoard, existingBoards = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    columns: ['To Do', 'In Progress', 'Review', 'Done']
  });
  const [errors, setErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);

  // Utility function to count words
  const getWordCount = (text) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Validation functions
  const validateBoardName = (name) => {
    const wordCount = name.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (!name.trim()) {
      return 'Board name is required';
    }
    
    if (wordCount > 100) {
      return 'Board name must be 100 words or less';
    }
    
    // Check for uniqueness (case-insensitive)
    const isDuplicate = existingBoards.some(board => 
      board.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    
    if (isDuplicate) {
      return 'A board with this name already exists';
    }
    
    return null;
  };

  const validateDescription = (description) => {
    if (!description.trim()) {
      return 'Description is required';
    }
    
    const wordCount = description.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (wordCount > 1000) {
      return 'Description must be 1000 words or less';
    }
    
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nameError = validateBoardName(formData.name);
    if (nameError) {
      newErrors.name = nameError;
    }
    
    const descriptionError = validateDescription(formData.description);
    if (descriptionError) {
      newErrors.description = descriptionError;
    }
    
    const validColumns = formData.columns.filter(col => col.trim().length > 0);
    if (validColumns.length === 0) {
      newErrors.columns = 'At least one column is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsCreating(true);
    
    const boardData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      columns: formData.columns.filter(col => col.trim().length > 0).map(col => col.trim())
    };
    
    try {
      await onCreateBoard(boardData);
      handleClose();
    } catch (error) {
      console.error('Error creating board:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      columns: ['To Do', 'In Progress', 'Review', 'Done']
    });
    setErrors({});
    setIsCreating(false);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const updateColumn = (index, value) => {
    const newColumns = [...formData.columns];
    newColumns[index] = value;
    setFormData({ ...formData, columns: newColumns });
  };

  const addColumn = () => {
    setFormData({ 
      ...formData, 
      columns: [...formData.columns, ''] 
    });
  };

  const removeColumn = (index) => {
    if (formData.columns.length > 1) {
      const newColumns = formData.columns.filter((_, i) => i !== index);
      setFormData({ ...formData, columns: newColumns });
    }
  };

  if (!isOpen) return null;

  const nameWordCount = getWordCount(formData.name);
  const descriptionWordCount = getWordCount(formData.description);

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          Create New Board
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Board Name *</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter board name"
              required
              style={{
                borderColor: errors.name ? '#ef4444' : '#d1d5db'
              }}
            />
            <WordCountContainer>
              {errors.name && (
                <ErrorMessage>
                  {errors.name}
                </ErrorMessage>
              )}
              <WordCount isOverLimit={nameWordCount > 100}>
                {nameWordCount}/100 words
              </WordCount>
            </WordCountContainer>
          </FormGroup>

          <FormGroup>
            <Label>Description *</Label>
            <TextArea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter board description"
              required
              style={{
                borderColor: errors.description ? '#ef4444' : '#d1d5db'
              }}
            />
            <WordCountContainer>
              {errors.description && (
                <ErrorMessage>
                  {errors.description}
                </ErrorMessage>
              )}
              <WordCount isOverLimit={descriptionWordCount > 1000}>
                {descriptionWordCount}/1000 words
              </WordCount>
            </WordCountContainer>
          </FormGroup>

          <FormGroup>
            <Label>Columns *</Label>
            <ColumnsContainer>
              {formData.columns.map((column, index) => (
                <ColumnItem key={index}>
                  <ColumnInput
                    type="text"
                    value={column}
                    onChange={(e) => updateColumn(index, e.target.value)}
                    placeholder={`Column ${index + 1}`}
                  />
                  {formData.columns.length > 1 && (
                    <RemoveColumnButton 
                      type="button" 
                      onClick={() => removeColumn(index)}
                    >
                      Remove
                    </RemoveColumnButton>
                  )}
                </ColumnItem>
              ))}
            </ColumnsContainer>
            <AddColumnButton type="button" onClick={addColumn}>
              + Add Column
            </AddColumnButton>
            {errors.columns && <ErrorMessage>{errors.columns}</ErrorMessage>}
          </FormGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={handleClose}>
              Cancel
            </CancelButton>
            <CreateButton type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Board'}
            </CreateButton>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateBoardModal;