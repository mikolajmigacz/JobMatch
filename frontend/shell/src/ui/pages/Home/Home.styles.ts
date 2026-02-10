import styled from 'styled-components';
import { theme } from '@/config/theme';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const HeroSection = styled.section<{ $secondary?: boolean }>`
  padding: ${theme.spacing[80]} ${theme.spacing[16]};
  text-align: center;
  background: ${(props) =>
    props.$secondary
      ? theme.colors.semantic.surface
      : `linear-gradient(135deg, ${theme.colors.accent.pink} 0%, ${theme.colors.accent.red} 100%)`};
  color: ${(props) =>
    props.$secondary ? theme.colors.semantic.text.primary : theme.colors.neutral.white};
  margin: 0;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[48]} ${theme.spacing[16]};
  }
`;

export const HeroTitle = styled.h1`
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.bold};
  margin: 0 0 ${theme.spacing[24]} 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes['4xl']};
    margin-bottom: ${theme.spacing[16]};
  }
`;

export const HeroSubtitle = styled.p`
  font-size: ${theme.typography.sizes.lg};
  margin: 0 0 ${theme.spacing[40]} 0;
  opacity: 0.95;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes.base};
    margin-bottom: ${theme.spacing[24]};
  }
`;

export const CTAButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[16]};
  justify-content: center;
  flex-wrap: wrap;
`;

export const CTAButton = styled.a<{ $variant: 'primary' | 'secondary' }>`
  padding: ${theme.spacing[16]} ${theme.spacing[32]};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  border-radius: ${theme.borderRadius.lg};
  text-decoration: none;
  transition: all ${theme.transitions.normal};
  border: 2px solid transparent;
  cursor: pointer;
  display: inline-block;

  ${(props) =>
    props.$variant === 'primary'
      ? `
    background: ${theme.colors.neutral.white};
    color: ${theme.colors.accent.pink};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.xl};
    }
  `
      : `
    background: transparent;
    color: ${theme.colors.neutral.white};
    border-color: ${theme.colors.neutral.white};
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
  `}

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[12]} ${theme.spacing[24]};
    font-size: ${theme.typography.sizes.sm};
    width: 100%;
  }
`;

export const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[80]} ${theme.spacing[16]};
  width: 100%;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[48]} ${theme.spacing[16]};
  }
`;

export const SectionTitle = styled.h2`
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.bold};
  text-align: center;
  background: linear-gradient(
    135deg,
    ${theme.colors.accent.pink} 0%,
    ${theme.colors.accent.red} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 ${theme.spacing[48]} 0;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes['3xl']};
    margin-bottom: ${theme.spacing[32]};
  }
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing[32]};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[24]};
  }
`;

export const FeatureCard = styled.div`
  padding: ${theme.spacing[32]};
  background: ${theme.colors.semantic.surface};
  border-radius: ${theme.borderRadius['2xl']};
  text-align: center;
  transition: all ${theme.transitions.normal};
  border: 1px solid ${theme.colors.semantic.border};

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${theme.shadows.lg};
    border-color: ${theme.colors.accent.pink};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[24]};
  }
`;

export const FeatureIcon = styled.div`
  font-size: ${theme.typography.sizes['5xl']};
  margin-bottom: ${theme.spacing[16]};
`;

export const FeatureTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.semantic.text.primary};
  margin: 0 0 ${theme.spacing[12]} 0;
`;

export const FeatureDescription = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.semantic.text.secondary};
  margin: 0;
  line-height: ${theme.typography.lineHeights.normal};
`;

export const StatisticsSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[80]} ${theme.spacing[16]};
  width: 100%;
  background: ${theme.colors.semantic.surface};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[48]} ${theme.spacing[16]};
  }
`;

export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[32]};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing[24]};
  }
`;

export const StatCard = styled.div`
  text-align: center;
  padding: ${theme.spacing[24]};
`;

export const StatNumber = styled.div`
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.bold};
  background: linear-gradient(
    135deg,
    ${theme.colors.accent.pink} 0%,
    ${theme.colors.accent.red} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${theme.spacing[8]};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes['4xl']};
  }
`;

export const StatLabel = styled.div`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.semantic.text.secondary};
  font-weight: ${theme.typography.weights.medium};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes.sm};
  }
`;

export const HowItWorksSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[80]} ${theme.spacing[16]};
  width: 100%;

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[48]} ${theme.spacing[16]};
  }
`;

export const HowItWorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing[48]};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[32]};
  }
`;

export const HowItWorksColumn = styled.div`
  padding: ${theme.spacing[32]};
  background: ${theme.colors.semantic.surface};
  border-radius: ${theme.borderRadius['2xl']};
  border: 1px solid ${theme.colors.semantic.border};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[24]};
  }
`;

export const StepNumber = styled.div`
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.accent.pink};
  margin-bottom: ${theme.spacing[8]};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
`;

export const StepTitle = styled.h3`
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.semantic.text.primary};
  margin: 0 0 ${theme.spacing[24]} 0;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes.xl};
  }
`;

export const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[16]};
`;

export const StepItem = styled.div`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.semantic.text.secondary};
  line-height: ${theme.typography.lineHeights.normal};
  padding-left: ${theme.spacing[8]};

  strong {
    color: ${theme.colors.semantic.text.primary};
    display: block;
    margin-bottom: ${theme.spacing[4]};
    font-weight: ${theme.typography.weights.semibold};
  }
`;
