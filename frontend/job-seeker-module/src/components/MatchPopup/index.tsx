'use client';

import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
`;

const float = keyframes`
  0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-600px) rotate(720deg); opacity: 0; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 48px 40px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: ${fadeIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
`;

const Emoji = styled.div`
  font-size: 64px;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #e91e8c;
  margin: 0 0 8px 0;
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 6px 0;
  font-weight: 600;
`;

const Company = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin: 0 0 24px 0;
`;

const CloseButton = styled.button`
  background: #e91e8c;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #c2185b;
  }
`;

const ProgressBar = styled.div<{ duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: #e91e8c;
  animation: shrink ${(p) => p.duration}ms linear forwards;
  @keyframes shrink {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
}

const ParticleItem = styled.div<Particle>`
  position: absolute;
  bottom: 0;
  left: ${(p) => p.x}%;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  background: ${(p) => p.color};
  border-radius: 50%;
  animation: ${float} ${(p) => p.duration}ms ${(p) => p.delay}ms ease-out forwards;
`;

const COLORS = ['#e91e8c', '#ff5722', '#4caf50', '#2196f3', '#ffc107', '#9c27b0'];
const AUTO_CLOSE_MS = 3000;

interface Props {
  jobTitle: string;
  company: string;
  onClose: () => void;
}

export default function MatchPopup({ jobTitle, company, onClose }: Props) {
  const particles: Particle[] = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[i % COLORS.length],
    size: 6 + Math.random() * 8,
    duration: 1200 + Math.random() * 1000,
    delay: Math.random() * 400,
  }));

  useEffect(() => {
    const t = setTimeout(onClose, AUTO_CLOSE_MS);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <Overlay onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        {particles.map((p) => (
          <ParticleItem key={p.id} {...p} />
        ))}
        <Emoji>🎉</Emoji>
        <Title>It&apos;s a Match!</Title>
        <Subtitle>{jobTitle}</Subtitle>
        <Company>{company}</Company>
        <CloseButton onClick={onClose}>Awesome!</CloseButton>
        <ProgressBar duration={AUTO_CLOSE_MS} />
      </Card>
    </Overlay>
  );
}
