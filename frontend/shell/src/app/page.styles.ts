import styled from 'styled-components';
import { theme } from '@/config/theme';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[40]} ${theme.spacing[16]};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[24]} ${theme.spacing[16]};
  }
`;

export const Hero = styled.section`
  text-align: center;
  margin-bottom: ${theme.spacing[48]};

  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-bottom: ${theme.spacing[32]};
  }
`;

export const Title = styled.h1`
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
  margin: 0 0 ${theme.spacing[16]} 0;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes['4xl']};
  }
`;

export const Subtitle = styled.p`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.semantic.text.secondary};
  margin: 0 0 ${theme.spacing[32]} 0;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes.base};
  }
`;

export const Section = styled.section`
  margin-bottom: ${theme.spacing[48]};

  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-bottom: ${theme.spacing[32]};
  }
`;
