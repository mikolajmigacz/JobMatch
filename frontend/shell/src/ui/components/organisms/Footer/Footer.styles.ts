import styled from 'styled-components';
import { theme } from '@/config/theme';

export const FooterWrapper = styled.footer`
  background: linear-gradient(
    180deg,
    ${theme.colors.primary.dark} 0%,
    ${theme.colors.primary.darkest} 100%
  );
  color: ${theme.colors.semantic.text.secondary};
  margin-top: auto;
  border-top: 1px solid ${theme.colors.semantic.border};
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[48]} ${theme.spacing[16]};

  @media (max-width: ${theme.breakpoints.desktop}) {
    padding: ${theme.spacing[40]} ${theme.spacing[20]};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[32]} ${theme.spacing[16]};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${theme.spacing[32]};
  margin-bottom: ${theme.spacing[32]};

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    gap: ${theme.spacing[24]};
    margin-bottom: ${theme.spacing[24]};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[16]};
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[16]};
`;

export const Title = styled.h3`
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.semantic.text.primary};
  margin: 0;
`;

export const FooterLink = styled.a`
  color: ${theme.colors.semantic.text.secondary};
  text-decoration: none;
  font-size: ${theme.typography.sizes.sm};
  transition: color ${theme.transitions.fast};
  cursor: pointer;

  &:hover {
    color: ${theme.colors.accent.pink};
  }

  &:active {
    color: ${theme.colors.accent.red};
  }
`;

export const Divider = styled.div`
  height: 1px;
  background-color: ${theme.colors.semantic.border};
  margin: ${theme.spacing[24]} 0;
`;

export const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${theme.spacing[24]};
  border-top: 1px solid ${theme.colors.semantic.border};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.semantic.text.tertiary};

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${theme.spacing[16]};
    text-align: center;
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing[16]};

  @media (max-width: ${theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;
