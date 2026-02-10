import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 24px;
`;

export const FormCard = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 32px;
  background: #1a2942;
  border-radius: 8px;
  border: 1px solid #2a3d52;
`;

export const Title = styled.h1`
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 600;
  color: #f5f6f7;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid #2a3d52;
  border-radius: 4px;
  background: #111f35;
  color: #f5f6f7;

  &::placeholder {
    color: #6b7280;
  }
`;

export const ErrorText = styled.span`
  font-size: 12px;
  color: #f63049;
  margin-top: 4px;
  display: block;
`;

export const SubmitButton = styled.button`
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  background: #d02752;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #b02045;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LinkText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #9ca3af;

  a {
    color: #d02752;
    text-decoration: none;
  }
`;
