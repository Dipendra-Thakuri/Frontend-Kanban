import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';
import NotificationBell from './NotificationBell';

const HeaderWrapper = styled.header`
  padding: 10px 0;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Nav = styled.nav`
  max-width: 1800px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const Brand = styled(Link)`
  color: #3b82f6;
  font-weight: 700;
  font-size: 1.8rem;
  margin: 0;
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
    color: #2563eb;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const NavButton = styled(Link)`
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  
  ${props => props.primary ? `
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  ` : `
    color: #64748b;
    
    &:hover {
      color: #3b82f6;
      background: #f1f5f9;
    }
  `}
`;

const MenuIcon = styled.div`
  font-size: 20px;
  cursor: pointer;
  color: #64748b;
  transition: color 0.2s ease;
  
  &:hover {
    color: #3b82f6;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  right: ${props => (props.open ? '0' : '-250px')};
  height: 100%;
  width: 250px;
  background: white;
  box-shadow: -2px 0 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  transition: right 0.2s ease;
  z-index: 1000;
  padding-top: 60px;
`;

const CloseIcon = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  transition: color 0.2s ease;
  
  &:hover {
    color: #3b82f6;
  }
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const MenuItem = styled(Link)`
  padding: 12px 0;
  font-size: 16px;
  color: #1e293b;
  text-decoration: none;
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f5f9;
    padding-left: 14px;
    color: #3b82f6;
  }
`;

const LogoutItem = styled.button`
  padding: 12px 0;
  font-size: 16px;
  color: #dc2626;
  background: none;
  border: none;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #fef2f2;
    padding-left: 14px;
    color: #b91c1c;
  }
`;

const WelcomeText = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1e293b;
`;

const RoleBadge = styled.span`
  background: ${props => props.role === 'ADMIN' || props.role === 'admin' ? '#3b82f6' : '#10b981'};
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  margin-left: 8px;
`;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate('/');
  };

  return (
    <>
      <HeaderWrapper>
        <Nav>
          <Brand to="/">Kanban Pro</Brand>
          <RightSection>
            {user ? (
              <NavButtons>
                {user && <NotificationBell />}
                <MenuIcon onClick={() => setSidebarOpen(true)}>
                  <FiMenu />
                </MenuIcon>
              </NavButtons>
            ) : (
              <NavButtons>
                <NavButton to="/login">Login</NavButton>
                <NavButton to="/register" primary>Sign Up</NavButton>
              </NavButtons>
            )}
          </RightSection>
        </Nav>
      </HeaderWrapper>

      <Sidebar open={sidebarOpen}>
        <CloseIcon onClick={() => setSidebarOpen(false)}>
          <FiX />
        </CloseIcon>
        <SidebarContent>
          {user && (
            <WelcomeText>
              Welcome, {user.username}
              <RoleBadge role={user.role}>{user.role}</RoleBadge>
            </WelcomeText>
          )}
          {user ? (
            <>
              <MenuItem to="/dashboard" onClick={() => setSidebarOpen(false)}>Dashboard</MenuItem>
              <MenuItem to="/kanban" onClick={() => setSidebarOpen(false)}>Board</MenuItem>
              <LogoutItem onClick={handleLogout}>Logout</LogoutItem>
            </>
          ) : (
            <>
              <MenuItem to="/login" onClick={() => setSidebarOpen(false)}>Login</MenuItem>
              <MenuItem to="/register" onClick={() => setSidebarOpen(false)}>Register</MenuItem>
            </>
          )}
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default Header;