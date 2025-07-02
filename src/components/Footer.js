// src/components/Footer.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: #1e293b;
  color: #94a3b8;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1800px;
  margin: 0 auto;
  padding: 60px 20px 40px;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const FooterSection = styled.div``;

const CompanySection = styled(FooterSection)`
  max-width: 350px;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 20px;
`;

const Description = styled.p`
  line-height: 1.6;
  margin-bottom: 20px;
  color: #94a3b8;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  background: #374151;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: #3b82f6;
    color: white;
    transform: translateY(-2px);
  }
`;

const SectionTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 20px;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FooterLink = styled(Link)`
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: #3b82f6;
  }
`;

const FooterButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  text-align: left;
  
  &:hover {
    color: #3b82f6;
  }
`;

const ExternalLink = styled.a`
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: #3b82f6;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #94a3b8;
`;

const ContactIcon = styled.div`
  width: 20px;
  height: 20px;
  background: #374151;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const FooterBottom = styled.div`
  border-top: 1px solid #374151;
  padding-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.div`
  font-size: 14px;
  color: #64748b;
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 30px;
  
  @media (max-width: 768px) {
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const BottomLink = styled(Link)`
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
  
  &:hover {
    color: #3b82f6;
  }
`;

const Newsletter = styled.div`
  margin-top: 20px;
`;

const NewsletterInput = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #374151;
  border-radius: 6px;
  background: #374151;
  color: white;
  
  &::placeholder {
    color: #94a3b8;
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const SubscribeButton = styled.button`
  padding: 12px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #2563eb;
  }
`;

// Modal Styles
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
  border-radius: 12px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  transition: color 0.2s ease;
  
  &:hover {
    color: #1e293b;
  }
`;

const ModalTitle = styled.h2`
  color: #1e293b;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
`;

const TeamSection = styled.div`
  margin-bottom: 25px;
`;

const SectionHeader = styled.h3`
  color: #3b82f6;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 8px;
`;

const GuideInfo = styled.div`
  background: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const GuideName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MemberItem = styled.div`
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
`;

const MemberName = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 5px;
`;

const MemberRole = styled.div`
  color: #64748b;
  font-size: 0.9rem;
`;

const Footer = () => {
  const location = useLocation();
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Show footer only on Home page and public pages
  const showFooter = ['/', '/features', '/pricing', '/about'].includes(location.pathname);
  
  if (!showFooter) {
    return null;
  }

  const handleAboutClick = () => {
    setShowAboutModal(true);
  };

  const closeModal = () => {
    setShowAboutModal(false);
  };

  return (
    <>
      <FooterContainer>
        <FooterContent>
          <FooterTop>
            <CompanySection>
              <Logo>Kanban Pro</Logo>
              <Description>
                Transform your team's productivity with visual project management. 
                Create boards, manage tasks, and collaborate seamlessly.
              </Description>
              <SocialLinks>
                <SocialLink href="#" aria-label="Twitter">🐦</SocialLink>
                <SocialLink href="#" aria-label="LinkedIn">💼</SocialLink>
                <SocialLink href="#" aria-label="GitHub">💻</SocialLink>
                <SocialLink href="#" aria-label="Facebook">📘</SocialLink>
              </SocialLinks>
            </CompanySection>

            <FooterSection>
              <SectionTitle>Company</SectionTitle>
              <FooterLinks>
                <FooterButton onClick={handleAboutClick}>About Us</FooterButton>
                <FooterLink to="/careers">Careers</FooterLink>
                <FooterLink to="/blog">Blog</FooterLink>
                <FooterLink to="/press">Press</FooterLink>
                <FooterLink to="/partners">Partners</FooterLink>
              </FooterLinks>
            </FooterSection>

            <FooterSection>
              <SectionTitle>Support</SectionTitle>
              <FooterLinks>
                <FooterLink to="/help">Help Center</FooterLink>
                <FooterLink to="/contact">Contact Us</FooterLink>
                <FooterLink to="/status">System Status</FooterLink>
                <ExternalLink href="mailto:support@kanbanpro.com">Email Support</ExternalLink>
              </FooterLinks>
              
              <ContactInfo style={{ marginTop: '20px' }}>
                <ContactItem>
                  <ContactIcon>📧</ContactIcon>
                  support@kanbanpro.com
                </ContactItem>
                <ContactItem>
                  <ContactIcon>📞</ContactIcon>
                  +91 9876543210
                </ContactItem>
              </ContactInfo>
            </FooterSection>

            <FooterSection>
              <SectionTitle>Stay Updated</SectionTitle>
              <Description>
                Get the latest updates and tips delivered to your inbox.
              </Description>
              <Newsletter>
                <NewsletterInput>
                  <EmailInput 
                    type="email" 
                    placeholder="Enter your email"
                  />
                  <SubscribeButton>Subscribe</SubscribeButton>
                </NewsletterInput>
              </Newsletter>
            </FooterSection>
          </FooterTop>

          <FooterBottom>
            <Copyright>
              © 2025 Kanban Pro. All rights reserved.
            </Copyright>
            
            <BottomLinks>
              <BottomLink to="/privacy">Privacy Policy</BottomLink>
              <BottomLink to="/terms">Terms of Service</BottomLink>
              <BottomLink to="/cookies">Cookie Policy</BottomLink>
              <BottomLink to="/sitemap">Sitemap</BottomLink>
            </BottomLinks>
          </FooterBottom>
        </FooterContent>
      </FooterContainer>

      {/* About Us Modal */}
      {showAboutModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <ModalTitle>About Our Team</ModalTitle>
            
            <TeamSection>
              <SectionHeader>Project Guide</SectionHeader>
              <GuideInfo>
                <GuideName>Rameshwari Enugurthi</GuideName>
              </GuideInfo>
            </TeamSection>

            <TeamSection>
              <SectionHeader>Development Team</SectionHeader>
              <MemberList>
                <MemberItem>
                  <MemberName>Monisha B</MemberName>
                  <MemberRole>Frontend & Backend Development</MemberRole>
                </MemberItem>
                <MemberItem>
                  <MemberName>Dipendra Thakuri</MemberName>
                  <MemberRole>Frontend & Backend Development</MemberRole>
                </MemberItem>
                <MemberItem>
                  <MemberName>Shreyash Kirve</MemberName>
                  <MemberRole>Frontend Development</MemberRole>
                </MemberItem>
              </MemberList>
            </TeamSection>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default Footer;