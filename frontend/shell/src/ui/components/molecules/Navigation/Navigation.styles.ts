import styled from 'styled-components';
import { theme } from '@/config/theme';

export const Nav = styled.nav<{ $open?: boolean }>`
  display: flex;
  gap: ${theme.spacing[32]};
  align-items: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: ${(props) => (props.$open ? 'flex' : 'none')};
    flex-direction: column;
    gap: ${theme.spacing[8]};
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    background: ${theme.colors.semantic.surface};
    padding: ${theme.spacing[16]};
    border-bottom: 1px solid ${theme.colors.semantic.border};
    box-shadow: ${theme.shadows.md};
  }
`;

export const NavLink = styled.a`
  color: ${theme.colors.semantic.text.secondary};
  text-decoration: none;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  transition: color ${theme.transitions.fast};
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: ${theme.colors.accent.pink};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    color: ${theme.colors.semantic.text.secondary};
    padding: ${theme.spacing[8]} 0;
    width: 100%;
  }
`;

export const Button = styled.a<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${theme.spacing[8]} ${theme.spacing[16]};
  border-radius: ${theme.borderRadius.md};
  text-decoration: none;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all ${theme.transitions.fast};
  display: inline-block;

  ${(props) =>
    props.$variant === 'primary'
      ? `
    background: linear-gradient(135deg, ${theme.colors.accent.pink} 0%, ${theme.colors.accent.red} 100%);
    color: ${theme.colors.neutral.white};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.lg};
    }
  `
      : `
    color: ${theme.colors.accent.pink};
    border: 1px solid ${theme.colors.accent.pink};
    
    &:hover {
      background-color: rgba(208, 39, 82, 0.1);
      transform: translateY(-2px);
    }
  `}

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
    text-align: center;
    padding: ${theme.spacing[8]} ${theme.spacing[16]};
  }
`;

export const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${theme.spacing[8]};
  font-size: ${theme.typography.sizes['2xl']};
  color: ${theme.colors.semantic.text.primary};

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: block;
  }
`;

export const NavContainer = styled.div`
  position: relative;
  display: contents;

  @media (max-width: 768px) {
    display: block;
  }
`;
