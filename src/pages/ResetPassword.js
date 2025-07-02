// src/pages/ResetPassword.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

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
  padding: 32px 27px;
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

const ErrorMessage = styled.span`
  font-size: 14px;
  color: #ef4444;
  font-weight: 500;
  margin-left: 4px;
  height: ${props => props.hasError ? 'auto' : '0'};
  overflow: hidden;
  transition: height 0.2s ease;
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

const BackLink = styled.div`
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

const Description = styled.p`
  font-size: 14px;
  color: #64748b;
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.5;
`;



const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  const watchPassword = watch('newPassword');

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setServerError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const onSubmit = async (data) => {
    if (!token) {
      setServerError('Invalid reset token');
      return;
    }

    setIsLoading(true);
    setServerError('');
    setSuccessMessage('');

    try {
      const res = await fetch('http://localhost:8080/api/v1/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          newPassword: data.newPassword 
        })
      });

      const result = await res.json();
      
      if (res.ok) {
        setSuccessMessage(result.message || 'Password reset successfully! Redirecting to login...');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setServerError(result.message || 'Error resetting password');
      }
    } catch (err) {
      setServerError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = () => {
    if (serverError) setServerError('');
    if (successMessage) setSuccessMessage('');
  };

  return (
    <Page>
      <Container>
        <BrandHeader>
          <BrandTitle>Kanban Pro</BrandTitle>
          <BrandSubtitle>Create New Password</BrandSubtitle>
        </BrandHeader>

        <Title>Reset <span>Password</span></Title>
        
        {!token ? (
          <>
            <ServerErrorMessage>
              Invalid reset link. Please request a new password reset.
            </ServerErrorMessage>
            <BackLink>
              <Link to="/forgot-password">Request New Reset Link</Link>
            </BackLink>
          </>
        ) : (
          <>
            <Description>
              Enter your new password below. Make sure it's strong and secure.
            </Description>
            
            <Form onSubmit={handleSubmit(onSubmit)}>
              <InputContainer>
                <Label>New Password</Label>
                <Input
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long'
                    },
                    maxLength: {
                      value: 100,
                      message: 'Password cannot exceed 100 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                    }
                  })}
                  type="password"
                  placeholder="Enter your new password"
                  hasError={!!errors.newPassword}
                  onChange={handleInputChange}
                />
                <ErrorMessage hasError={!!errors.newPassword}>
                  {errors.newPassword?.message || ''}
                </ErrorMessage>
              </InputContainer>

              <InputContainer>
                <Label>Confirm New Password</Label>
                <Input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => 
                      value === watchPassword || 'Passwords do not match'
                  })}
                  type="password"
                  placeholder="Confirm your new password"
                  hasError={!!errors.confirmPassword}
                  onChange={handleInputChange}
                />
                <ErrorMessage hasError={!!errors.confirmPassword}>
                  {errors.confirmPassword?.message || ''}
                </ErrorMessage>
              </InputContainer>

              {serverError && <ServerErrorMessage>{serverError}</ServerErrorMessage>}
              {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

              <Button type="submit" disabled={isLoading}>
                {isLoading && <LoadingSpinner />}
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </Form>
          </>
        )}

        <BackLink>
          Remember your password?
          <Link to="/login">Back to Login</Link>
        </BackLink>
      </Container>
    </Page>
  );
};

export default ResetPassword;