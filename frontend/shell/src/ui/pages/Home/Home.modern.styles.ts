import styled, { keyframes, css } from 'styled-components';
import { theme } from '@/config/theme';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background-color: ${theme.colors.primary.darkest};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -100px;
    left: 20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, ${theme.colors.accent.pink}15 0%, transparent 70%);
    filter: blur(100px);
    z-index: 0;
    pointer-events: none;
    animation: ${float} 15s ease-in-out infinite;
  }
`;

export const HeroSection = styled.section<{ $secondary?: boolean }>`
  padding: ${theme.spacing[80]} ${theme.spacing[16]};
  text-align: center;
  position: relative;
  z-index: 1;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* Modern mesh gradient background for secondary variant */
  ${(props) =>
    !props.$secondary &&
    css`
      background: radial-gradient(
        circle at 50% 50%,
        ${theme.colors.primary.darkest} 0%,
        #0b1626 100%
      );
    `}

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[48]} ${theme.spacing[16]};
    min-height: auto;
  }
`;

export const HeroTitle = styled.h1`
  font-size: 5rem;
  line-height: 1.1;
  font-weight: 800;
  margin: 0 0 ${theme.spacing[32]} 0;
  max-width: 1000px;
  background: linear-gradient(180deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -2px;
  text-wrap: balance;
  animation: ${fadeIn} 0.8s ease-out forwards;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 2.75rem;
    margin-bottom: ${theme.spacing[20]};
    line-height: 1.2;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: ${theme.typography.sizes.xl};
  line-height: 1.6;
  color: ${theme.colors.neutral.gray300};
  margin: 0 0 ${theme.spacing[56]} 0;
  max-width: 650px;
  text-wrap: pretty;
  animation: ${fadeIn} 0.8s ease-out 0.2s forwards;
  opacity: 0;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes.base};
    margin-bottom: ${theme.spacing[32]};
  }
`;

export const CTAButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[20]};
  justify-content: center;
  flex-wrap: wrap;
  animation: ${fadeIn} 0.8s ease-out 0.4s forwards;
  opacity: 0;
`;

export const CTAButton = styled.a<{ $variant: 'primary' | 'secondary' }>`
  padding: ${theme.spacing[16]} ${theme.spacing[48]};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  border-radius: 9999px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.$variant === 'primary'
      ? css`
          background: linear-gradient(
            90deg,
            ${theme.colors.accent.pink},
            ${theme.colors.accent.red}
          );
          color: ${theme.colors.neutral.white};
          box-shadow: 0 10px 30px -10px ${theme.colors.accent.pink}80;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 40px -10px ${theme.colors.accent.pink};
            filter: brightness(1.1);
          }

          &:active {
            transform: translateY(0);
          }
        `
      : css`
          background: rgba(255, 255, 255, 0.03);
          color: ${theme.colors.neutral.white};
          border-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);

          &:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: ${theme.colors.neutral.white};
            transform: translateY(-2px);
          }
        `}

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[12]} ${theme.spacing[32]};
    font-size: ${theme.typography.sizes.base};
    width: 100%;
  }
`;

export const FeaturesSection = styled.section`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${theme.spacing[80]} ${theme.spacing[32]};
  width: 100%;
  position: relative;
`;

export const SectionTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  text-align: center;
  color: ${theme.colors.neutral.white};
  margin: 0 0 ${theme.spacing[80]} 0;
  letter-spacing: -1.5px;
  position: relative;

  /* Gradient text */
  background: linear-gradient(
    135deg,
    ${theme.colors.neutral.white} 30%,
    ${theme.colors.neutral.gray300} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 2.25rem;
    margin-bottom: ${theme.spacing[48]};
  }
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${theme.spacing[32]};
  position: relative;

  /* Decorative background blob */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    right: -200px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, ${theme.colors.accent.red}10 0%, transparent 60%);
    filter: blur(80px);
    z-index: -1;
    pointer-events: none;
  }
`;

export const FeatureCard = styled.div`
  padding: ${theme.spacing[40]};
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: ${theme.borderRadius['2xl']};
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  position: relative;
  overflow: hidden;
  height: 100%;

  /* Subtle gradient background on hover */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at top right,
      ${theme.colors.accent.pink}15,
      transparent 60%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px);
    border-color: ${theme.colors.accent.pink}40;
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 20px 40px -20px ${theme.colors.primary.darkest};

    &::before {
      opacity: 1;
    }
  }
`;

export const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${theme.spacing[28]};
  background: rgba(255, 255, 255, 0.05);
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.4s ease;
  position: relative;
  z-index: 1;

  ${FeatureCard}:hover & {
    transform: scale(1.1) rotate(5deg);
    background: linear-gradient(135deg, ${theme.colors.accent.pink}, ${theme.colors.accent.red});
    border-color: transparent;
  }
`;

export const FeatureTitle = styled.h3`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.neutral.white};
  margin: 0 0 ${theme.spacing[16]} 0;
  position: relative;
  z-index: 1;
`;

export const FeatureDescription = styled.p`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.neutral.gray300};
  margin: 0;
  line-height: 1.7;
  position: relative;
  z-index: 1;
`;

export const StatisticsSection = styled.section`
  max-width: 1400px;
  margin: ${theme.spacing[64]} auto;
  padding: 0 ${theme.spacing[16]};
  width: 100%;
`;

export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing[8]};
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${theme.borderRadius['3xl']};
  padding: ${theme.spacing[40]};
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing[32]};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    background: transparent;
    border: none;
    padding: 0;
  }
`;

export const StatCard = styled.div`
  text-align: center;
  padding: 0 ${theme.spacing[24]};
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 20%;
    bottom: 20%;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent);
  }

  @media (max-width: ${theme.breakpoints.desktop}) {
    &:nth-child(2n)::after {
      display: none;
    }
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[24]} 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    &::after {
      display: none;
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

export const StatNumber = styled.div`
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: 800;
  background: linear-gradient(
    180deg,
    ${theme.colors.neutral.white} 20%,
    rgba(255, 255, 255, 0.6) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${theme.spacing[8]};
  letter-spacing: -2px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes['4xl']};
  }
`;

export const StatLabel = styled.div`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.accent.pink};
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 0.875rem;
`;

export const HowItWorksSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[80]} ${theme.spacing[16]};
  width: 100%;
`;

export const HowItWorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing[64]};
  align-items: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[32]};
  }
`;

export const HowItWorksColumn = styled.div`
  padding: ${theme.spacing[48]};
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border-radius: ${theme.borderRadius['3xl']};
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  /* Glow effect */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, ${theme.colors.accent.pink}10 0%, transparent 70%);
    filter: blur(40px);
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[24]};
  }
`;

export const StepNumber = styled.div`
  display: inline-block;
  padding: ${theme.spacing[8]} ${theme.spacing[16]};
  background: rgba(208, 39, 82, 0.1);
  color: ${theme.colors.accent.pink};
  border-radius: 100px;
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.sm};
  margin-bottom: ${theme.spacing[24]};
  border: 1px solid rgba(208, 39, 82, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const StepTitle = styled.h3`
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.neutral.white};
  margin: 0 0 ${theme.spacing[32]} 0;
  letter-spacing: -0.5px;
`;

export const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[32]};
`;

export const StepItem = styled.div`
  background: transparent;
  padding: 0;
  padding-left: ${theme.spacing[24]};
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  color: ${theme.colors.neutral.gray300};
  line-height: 1.6;
  font-size: ${theme.typography.sizes.base};

  &:hover {
    border-left-color: ${theme.colors.accent.pink};
    padding-left: ${theme.spacing[32]};
  }

  strong {
    color: ${theme.colors.neutral.white};
    display: block;
    margin-bottom: ${theme.spacing[8]};
    font-size: ${theme.typography.sizes.lg};
    font-weight: ${theme.typography.weights.semibold};
  }
`;
