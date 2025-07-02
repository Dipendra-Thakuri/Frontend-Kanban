// src/pages/Register.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Page = styled.div`
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 15px;
  box-sizing: border-box;
`;

const Container = styled.div`
  background: white;
  padding: 25px 25px;
  border-radius: 15px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 380px;
  box-sizing: border-box;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
  margin: auto;
  
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
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #1e293b;
  text-align: center;
  
  span {
    color: #3b82f6;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 2px solid ${props => props.hasError ? '#ef4444' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 14px;
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
  font-size: 12px;
  color: #ef4444;
  font-weight: 500;
  margin-left: 4px;
  height: ${props => props.hasError ? 'auto' : '0'};
  overflow: hidden;
  transition: height 0.2s ease;
`;

const PasswordStrength = styled.div`
  font-size: 12px;
  margin-left: 4px;
  height: ${props => props.show ? 'auto' : '0'};
  overflow: hidden;
  transition: height 0.2s ease;
  font-weight: 500;
  color: ${props => {
    switch (props.strength) {
      case 'weak': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'strong': return '#10b981';
      default: return '#64748b';
    }
  }};
`;

const Button = styled.button`
  padding: 10px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 8px;

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
  font-size: 12px;
  color: #ef4444;
  font-weight: 500;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  padding: 10px;
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
  font-size: 12px;
  color: #10b981;
  font-weight: 500;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #bbf7d0;
  margin: 0;
  position: relative;
  
  &::before {
    content: '✅';
    margin-right: 6px;
  }
`;

const LoginPrompt = styled.div`
  margin-top: 15px;
  text-align: center;
  font-size: 13px;
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
  margin-bottom: 20px;
`;

const BrandTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 700;
  color: #3b82f6;
  margin: 0 0 3px 0;
`;

const BrandSubtitle = styled.p`
  font-size: 12px;
  color: #64748b;
  margin: 0;
`;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
  const [isServerError, setIsServerError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const watchPassword = watch('password');

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    if (!password) return '';
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    // Common patterns penalty
    if (/(.)\1{2,}/.test(password)) score -= 1; // repeated characters
    if (/123|abc|qwe/i.test(password)) score -= 1; // common sequences
    
    if (score < 3) return 'weak';
    if (score < 5) return 'medium';
    return 'strong';
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return 'Weak password';
      case 'medium': return 'Medium strength password';
      case 'strong': return 'Strong password';
      default: return '';
    }
  };

  const handleInputChange = (fieldName) => {
    // Clear server messages when user starts typing
    if (serverMessage) {
      setServerMessage('');
      setIsServerError(false);
    }

    // Calculate password strength for password field
    if (fieldName === 'password') {
      const currentPassword = watchPassword;
      setPasswordStrength(calculatePasswordStrength(currentPassword));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setServerMessage('');
    setIsServerError(false);

    try {
      // Check if user already exists
      const checkRes = await fetch(`http://localhost:8080/api/v1/register?email=${encodeURIComponent(data.email.trim())}`);
      
      if (!checkRes.ok) {
        throw new Error('Failed to check existing users');
      }

      const existingUsers = await checkRes.json();

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        setIsServerError(true);
        setServerMessage('User with this email already exists. Please login or use a different email.');
        setLoading(false);
        return;
      }

      // Prepare data for registration
      const registrationData = {
        username: data.username.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password
      };

      const res = await axios.post('http://localhost:8080/api/v1/register', registrationData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      if (res.status === 200 || res.status === 201) {
        setServerMessage('Registration successful! Redirecting to login...');
        setIsServerError(false);
        
        // Reset form
        reset();
        setPasswordStrength('');
        
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setIsServerError(true);
        setServerMessage('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      setIsServerError(true);
      
      if (err.code === 'ECONNABORTED') {
        setServerMessage('Request timeout. Please check your connection and try again.');
      } else if (err.response) {
        // Server responded with error status
        switch (err.response.status) {
          case 409:
            setServerMessage('User already exists with this email or username.');
            break;
          case 400:
            setServerMessage(err.response.data?.message || 'Invalid registration data.');
            break;
          case 500:
            setServerMessage('Server error. Please try again later.');
            break;
          default:
            setServerMessage(err.response.data?.message || 'Registration failed. Please try again.');
        }
      } else if (err.request) {
        setServerMessage('Unable to connect to server. Please check your internet connection.');
      } else {
        setServerMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Container>
        <BrandHeader>
          <BrandTitle>Kanban Pro</BrandTitle>
          <BrandSubtitle>Create your account to get started</BrandSubtitle>
        </BrandHeader>

        <Title>Create <span>Account</span></Title>
        
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
                  message: 'Username must be less than 50 characters'
                },
                pattern: {
                  value: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                  message: 'Username can only contain letters, numbers, and underscores'
                },
                validate: {
                  notOnlyNumbers: (value) => 
                    !/^\d+$/.test(value) || 'Username cannot be only numbers'
                }
              })}
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
              hasError={!!errors.username}
              disabled={loading}
              maxLength="50"
              onChange={() => handleInputChange('username')}
            />
            <ErrorMessage hasError={!!errors.username}>
              {errors.username?.message || ''}
            </ErrorMessage>
          </InputContainer>

          <InputContainer>
            <Label>Email</Label>
            <Input
              {...register('email', {
                required: 'Email is required',
                maxLength: {
                  value: 254,
                  message: 'Email address is too long'
                },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address'
                }
              })}
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              hasError={!!errors.email}
              disabled={loading}
              maxLength="254"
              onChange={() => handleInputChange('email')}
            />
            <ErrorMessage hasError={!!errors.email}>
              {errors.email?.message || ''}
            </ErrorMessage>
          </InputContainer>

          <InputContainer>
            <Label>Password</Label>
            <Input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long'
                },
                maxLength: {
                  value: 128,
                  message: 'Password must be less than 128 characters'
                },
                validate: {
                  hasLowercase: (value) => 
                    /(?=.*[a-z])/.test(value) || 'Password must contain at least one lowercase letter',
                  hasUppercase: (value) => 
                    /(?=.*[A-Z])/.test(value) || 'Password must contain at least one uppercase letter',
                  hasNumber: (value) => 
                    /(?=.*\d)/.test(value) || 'Password must contain at least one number',
                  hasSpecialChar: (value) => 
                    /(?=.*[^a-zA-Z0-9])/.test(value) || 'Password must contain at least one special character'
                }
              })}
              type="password"
              placeholder="Enter your password"
              autoComplete="new-password"
              hasError={!!errors.password}
              disabled={loading}
              maxLength="128"
              onChange={() => handleInputChange('password')}
            />
            <ErrorMessage hasError={!!errors.password}>
              {errors.password?.message || ''}
            </ErrorMessage>
            <PasswordStrength 
              strength={passwordStrength} 
              show={passwordStrength && !errors.password}
            >
              {getPasswordStrengthText()}
            </PasswordStrength>
          </InputContainer>

          <InputContainer>
            <Label>Confirm Password</Label>
            <Input
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: {
                  matchesPassword: (value) => 
                    value === watchPassword || 'Passwords do not match'
                }
              })}
              type="password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              hasError={!!errors.confirmPassword}
              disabled={loading}
              maxLength="128"
              onChange={() => handleInputChange('confirmPassword')}
            />
            <ErrorMessage hasError={!!errors.confirmPassword}>
              {errors.confirmPassword?.message || ''}
            </ErrorMessage>
          </InputContainer>

          {serverMessage && (
            isServerError ? 
              <ServerErrorMessage>{serverMessage}</ServerErrorMessage> :
              <SuccessMessage>{serverMessage}</SuccessMessage>
          )}
          
          <Button type="submit" disabled={loading}>
            {loading && <LoadingSpinner />}
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Form>

        <LoginPrompt>
          Already have an account?
          <Link to="/login">Sign In</Link>
        </LoginPrompt>
      </Container>
    </Page>
  );
};

export default Register;