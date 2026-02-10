import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

export const Loader = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #2a3d52;
  border-top-color: #d02752;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;
