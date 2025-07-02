// src/pages/Login.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Page = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  box-sizing: border-box;
`;

const Container = styled.div`
  background: white;
  padding: 35px 30px;
  border-radius: 15px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 380px;
  box-sizing: border-box;
  color: #1e293b;
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
    background: linear-gradient(90deg, #3b82f6, #2563eb);
  }
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1e293b;
  text-align: center;
  
  span {
    color: #3b82f6;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
`;

const Input = styled.input`
  padding: 12px 14px;
  border: 2px solid ${props => props.hasError ? '#ef4444' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 15px;
  background-color: ${props => props.hasError ? '#fef2f2' : '#f8fafc'};
  transition: all 0.3s ease;
  color: #1e293b;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#3b82f6'};
    background-color: white;
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ErrorMessage = styled.span`
  font-size: 14px;
  color: #ef4444;
  font-weight: 500;
  margin-left: 4px;
  height: ${props => props.hasError ? 'auto' : '0'};
  overflow: hidden;
  transition: height 0.2s ease;
`;

const Button = styled.button`
  padding: 12px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ServerErrorMessage = styled.div`
  text-align: center;
  font-size: 13px;
  color: #ef4444;
  font-weight: 500;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #fecaca;
  margin: 0;
  position: relative;
  
  &::before {
    content: '⚠️';
    margin-right: 6px;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  font-size: 13px;
  color: #10b981;
  font-weight: 500;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #bbf7d0;
  margin: 0;
  position: relative;
  
  &::before {
    content: '✅';
    margin-right: 6px;
  }
`;

const RegisterPrompt = styled.div`
  margin-top: 18px;
  text-align: center;
  font-size: 14px;
  color: #64748b;

  a {
    font-weight: 600;
    color: #3b82f6;
    text-decoration: none;
    margin-left: 5px;
    transition: color 0.2s ease;

    &:hover {
      color: #2563eb;
      text-decoration: underline;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s ease-in-out infinite;
  margin-right: 8px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const BrandHeader = styled.div`
  text-align: center;
  margin-bottom: 25px;
`;

const BrandTitle = styled.h1`
  font-size: 1.3rem;
  font-weight: 700;
  color: #3b82f6;
  margin: 0 0 4px 0;
`;

const BrandSubtitle = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0;
`;

const useToken = () => {
  const getToken = () => localStorage.getItem('auth_token');
  const saveToken = (token) => localStorage.setItem('auth_token', token);
  const removeToken = () => localStorage.removeItem('auth_token');
  return { getToken, saveToken, removeToken };
};

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { saveToken } = useToken();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    setSuccessMessage('');

    try {
      const res = await fetch('http://localhost:8080/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          password: data.password
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Login failed');
      }

      const responseData = await res.json();

      if (!responseData.token) {
        throw new Error('Token not returned from server');
      }

      // Save authentication data
      saveToken(responseData.token);
      localStorage.setItem('auth_user', responseData.username);
      localStorage.setItem('auth_role', responseData.role);
      localStorage.setItem('auth_email', responseData.email || '');

      // Update auth context
      setUser({
        username: responseData.username,
        role: responseData.role,
        email: responseData.email || '',
      });

      // Show success message briefly before navigation
      setSuccessMessage('Login successful! Redirecting...');
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      setServerError(err.message || 'Server error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = () => {
    // Clear server error when user starts typing
    if (serverError) {
      setServerError('');
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  return (
    <Page>
      <Container>
        <BrandHeader>
          <BrandTitle>Kanban Pro</BrandTitle>
          <BrandSubtitle>Welcome back! Sign in to your account</BrandSubtitle>
        </BrandHeader>

        <Title>Sign <span>In</span></Title>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputContainer>
            <Label>Username</Label>
            <Input
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters long'
                },
                maxLength: {
                  value: 50,
                  message: 'Username cannot exceed 50 characters'
                },
                pattern: {
                  value: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                  message: 'Username can only contain letters, numbers, and underscores'
                }
              })}
              type="text"
              placeholder="Enter your username"
              hasError={!!errors.username}
              onChange={handleInputChange}
            />
            <ErrorMessage hasError={!!errors.username}>
              {errors.username?.message || ''}
            </ErrorMessage>
          </InputContainer>

          <InputContainer>
            <Label>Password</Label>
            <Input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long'
                },
                maxLength: {
                  value: 100,
                  message: 'Password cannot exceed 100 characters'
                }
              })}
              type="password"
              placeholder="Enter your password"
              hasError={!!errors.password}
              onChange={handleInputChange}
            />
            <ErrorMessage hasError={!!errors.password}>
              {errors.password?.message || ''}
            </ErrorMessage>
          </InputContainer>

          {serverError && <ServerErrorMessage>{serverError}</ServerErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading && <LoadingSpinner />}
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>

        <RegisterPrompt>
          Don't have an account?
          <Link to="/register">Create Account</Link>
        </RegisterPrompt>
      </Container>
    </Page>
  );
};

export default Login;