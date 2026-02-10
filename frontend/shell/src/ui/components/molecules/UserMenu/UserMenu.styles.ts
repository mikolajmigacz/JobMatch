import styled from 'styled-components';
import { theme } from '@/config/theme';

export const MenuContainer = styled.div`
  position: relative;
`;

export const MenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[8]};
  background: none;
  border: 1px solid ${theme.colors.semantic.border};
  border-radius: ${theme.borderRadius.full};
  padding: ${theme.spacing[6]} ${theme.spacing[12]};
  cursor: pointer;
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.semantic.text.primary};
  transition: all ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.accent.pink};
    color: ${theme.colors.accent.pink};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[8]} ${theme.spacing[12]};
    font-size: ${theme.typography.sizes.xs};
  }
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${theme.colors.accent.pink} 0%,
    ${theme.colors.accent.red} 100%
  );
  color: ${theme.colors.neutral.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.weights.semibold};
  font-size: ${theme.typography.sizes.sm};

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 28px;
    height: 28px;
    font-size: ${theme.typography.sizes.xs};
  }
`;

export const DropdownMenu = styled.div<{ $open: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${theme.colors.semantic.surface};
  border: 1px solid ${theme.colors.semantic.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  min-width: 200px;
  margin-top: ${theme.spacing[8]};
  display: ${(props) => (props.$open ? 'flex' : 'none')};
  flex-direction: column;
  z-index: 101;

  @media (max-width: ${theme.breakpoints.tablet}) {
    min-width: 160px;
  }
`;

export const MenuItem = styled.a`
  padding: ${theme.spacing[12]} ${theme.spacing[16]};
  color: ${theme.colors.semantic.text.primary};
  text-decoration: none;
  font-size: ${theme.typography.sizes.sm};
  border-bottom: 1px solid ${theme.colors.semantic.border};
  transition: background-color ${theme.transitions.fast};
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.semantic.surfaceHover};
    color: ${theme.colors.accent.pink};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[8]} ${theme.spacing[12]};
    font-size: ${theme.typography.sizes.xs};
  }
`;

export const LogoutButton = styled.button`
  width: 100%;
  padding: ${theme.spacing[12]} ${theme.spacing[16]};
  background: none;
  border: none;
  border-top: 1px solid ${theme.colors.semantic.border};
  color: ${theme.colors.status.error};
  text-align: left;
  cursor: pointer;
  font-size: ${theme.typography.sizes.sm};
  transition: background-color ${theme.transitions.fast};

  &:hover {
    background-color: rgba(246, 48, 73, 0.1);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[8]} ${theme.spacing[12]};
    font-size: ${theme.typography.sizes.xs};
  }
`;

export const UserInfo = styled.div`
  padding: ${theme.spacing[12]} ${theme.spacing[16]};
  border-bottom: 1px solid ${theme.colors.semantic.border};
  font-size: ${theme.typography.sizes.xs};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing[8]} ${theme.spacing[12]};
  }
`;

export const Email = styled.div`
  color: ${theme.colors.semantic.text.tertiary};
  margin-top: ${theme.spacing[4]};
`;
