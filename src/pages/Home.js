// src/pages/Home.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer'

const HomeContainer = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  color: #1e293b;
  overflow-x: hidden; /* Prevent horizontal scroll */
`;

const HeroSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1e293b;
  
  span {
    color: #3b82f6;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 60px;
  flex-wrap: wrap;
`;

const CTAButton = styled(Link)`
  padding: 16px 32px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  ${props => props.primary ? `
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
    }
  ` : `
    background: white;
    color: #3b82f6;
    border: 2px solid #3b82f6;
    
    &:hover {
      background: #3b82f6;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
    }
  `}
`;

const FeaturesSection = styled.section`
  max-width: 1800px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 60px;
  color: #1e293b;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 40px;
  }
`;

const FeatureGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 80px;
  width: 100%;
`;

const FeatureCard = styled.div`
  display: flex;
  align-items: center;
  min-height: 400px;
  background: white;
  width: 100%;
  
  &:nth-child(even) {
    flex-direction: row-reverse;
    background: #f8fafc;
  }
  
  @media (max-width: 768px) {
    flex-direction: column !important;
    min-height: auto;
  }
`;

const FeatureContent = styled.div`
  flex: 1;
  padding: 60px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const FeatureImageContainer = styled.div`
  flex: 1;
  height: 400px;
  background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  width: 100%;
  
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const FeatureImage = styled.img`
  width: 100%;
  height: 100%;
  z-index: 1;
  position: relative;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
  object-fit: cover;
`;

const FeatureTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1e293b;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const FeatureText = styled.p`
  color: #64748b;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const BenefitsSection = styled.section`
  background: white;
  padding: 80px 20px;
  width: 100%;
  box-sizing: border-box;
`;

const BenefitsContainer = styled.div`
  max-width: 1800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  width: 100%;
`;

const BenefitItem = styled.div`
  text-align: center;
`;

const BenefitNumber = styled.div`
  background: #3b82f6;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 20px;
`;

const BenefitTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #1e293b;
`;

const BenefitText = styled.p`
  color: #64748b;
  line-height: 1.5;
`;

const Home = () => {
  return (
    <HomeContainer>

      <HeroSection>
        <Title>Organize Your Work with <span>Kanban Pro</span></Title>
        <Subtitle>
          Transform your team's productivity with visual project management. 
          Create boards, manage tasks, and collaborate seamlessly in one beautiful interface.
        </Subtitle>
        <CTAButtons>
          <CTAButton to="/register" primary>Start Free Trial</CTAButton>
        </CTAButtons>
      
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Why Choose Kanban Pro?</SectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <FeatureContent>
              <FeatureTitle>Intuitive Visual Boards</FeatureTitle>
              <FeatureText>
                Transform your workflow with beautiful, drag-and-drop Kanban boards. 
                Create custom columns, organize tasks with ease, and see your project's 
                progress at a glance. No more scattered to-do lists or confusing spreadsheets.
              </FeatureText>
            </FeatureContent>
            <FeatureImageContainer>
              <FeatureImage src="/images/kanban-preview.jpg" alt="Group Preview" />
            </FeatureImageContainer>
          </FeatureCard>

          <FeatureCard>
            <FeatureContent>
              <FeatureTitle>Seamless Team Collaboration</FeatureTitle>
              <FeatureText>
                Bring your team together in one workspace. Assign tasks, share updates, 
                and communicate directly on task cards. Real-time synchronization ensures 
                everyone stays informed and productive, whether they're in the office or remote.
              </FeatureText>
            </FeatureContent>
            <FeatureImageContainer>
              <FeatureImage src="/images/group-preview.jpg" alt="Group Preview" />
            </FeatureImageContainer>
          </FeatureCard>

          <FeatureCard>
            <FeatureContent>
              <FeatureTitle>Lightning Fast Performance</FeatureTitle>
              <FeatureText>
                Experience blazing-fast load times and smooth interactions. 
                Our optimized platform handles large projects effortlessly, with 
                cloud synchronization that keeps your data secure and accessible anywhere.
              </FeatureText>
            </FeatureContent>
            <FeatureImageContainer>
              <FeatureImage src="/images/laptop-preview.png" alt="laptop Preview" />
            </FeatureImageContainer>
          </FeatureCard>

          <FeatureCard>
            <FeatureContent>
              <FeatureTitle>Mobile-First Design</FeatureTitle>
              <FeatureText>
                Stay productive on any device with our responsive, mobile-optimized interface. 
                Access your boards, update tasks, and collaborate with your team whether 
                you're at your desk or on the move.
              </FeatureText>
            </FeatureContent>
            <FeatureImageContainer>
              <FeatureImage src="/images/mobile-preview.jpg" alt="Mobile Preview" />
            </FeatureImageContainer>
          </FeatureCard>
        </FeatureGrid>
      </FeaturesSection>

      <BenefitsSection>
        <SectionTitle>How It Works</SectionTitle>
        <BenefitsContainer>
          <BenefitItem>
            <BenefitNumber>1</BenefitNumber>
            <BenefitTitle>Create Your Board</BenefitTitle>
            <BenefitText>
              Start with a template or build from scratch. 
              Add columns that match your workflow.
            </BenefitText>
          </BenefitItem>
          <BenefitItem>
            <BenefitNumber>2</BenefitNumber>
            <BenefitTitle>Add Tasks & Details</BenefitTitle>
            <BenefitText>
              Create task cards with descriptions, due dates, 
              and assign them to team members.
            </BenefitText>
          </BenefitItem>
          <BenefitItem>
            <BenefitNumber>3</BenefitNumber>
            <BenefitTitle>Track Progress</BenefitTitle>
            <BenefitText>
              Move cards through columns as work progresses. 
              Visual updates keep everyone informed.
            </BenefitText>
          </BenefitItem>
          <BenefitItem>
            <BenefitNumber>4</BenefitNumber>
            <BenefitTitle>Collaborate & Deliver</BenefitTitle>
            <BenefitText>
              Comment on cards, share updates, and celebrate 
              completed projects with your team.
            </BenefitText>
          </BenefitItem>
        </BenefitsContainer>
      </BenefitsSection>

      <Footer />
    </HomeContainer>
  );
};

export default Home;