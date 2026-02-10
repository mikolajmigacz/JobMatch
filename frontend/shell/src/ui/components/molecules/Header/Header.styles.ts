import styled from 'styled-components';
import { theme } from '@/config/theme';

export const HeaderWrapper = styled.header`
  background: rgba(17, 31, 53, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[16]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;

  @media (max-width: ${theme.breakpoints.tablet}) {
    height: 56px;
    padding: 0 ${theme.spacing[12]};
  }
`;

export const Logo = styled.a`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[8]};
  flex-shrink: 0;
  cursor: pointer;
  transition:
    transform ${theme.transitions.fast},
    filter ${theme.transitions.fast};
  height: 40px;

  img {
    height: 100%;
    width: auto;
    transition:
      transform ${theme.transitions.fast},
      filter ${theme.transitions.fast};
  }

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);

    img {
      transform: translateY(-2px);
      filter: brightness(1.1);
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    height: 36px;
  }
`;

export const LogoIcon = styled.span`
  font-size: ${theme.typography.sizes['2xl']};
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[24]};

  @media (max-width: ${theme.breakpoints.tablet}) {
    gap: ${theme.spacing[16]};
  }
`;
