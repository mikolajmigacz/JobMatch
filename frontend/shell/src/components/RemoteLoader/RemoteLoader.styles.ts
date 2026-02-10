import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 24px;
`;

export const Loader = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #2a3d52;
  border-top-color: #d02752;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const Fallback = styled.div`
  padding: 24px;
  background: #1a2942;
  border: 1px solid #2a3d52;
  border-radius: 8px;
  color: #f5f6f7;

  strong {
    display: block;
    margin-bottom: 8px;
    color: #f63049;
  }

  p {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: #9ca3af;
  }
`;

export const RetryButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  background: #d02752;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #b02045;
  }
`;
