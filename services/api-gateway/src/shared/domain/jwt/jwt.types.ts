export interface TokenPayload {
  sub: string;
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export class JwtError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JwtError';
  }
}

export class TokenExpiredError extends JwtError {
  constructor() {
    super('Token has expired');
    this.name = 'TokenExpiredError';
  }
}

export class InvalidTokenError extends JwtError {
  constructor() {
    super('Invalid token');
    this.name = 'InvalidTokenError';
  }
}
