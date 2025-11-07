export interface TokenPayload {
  userId: string;
  email: string;
  role: 'job_seeker' | 'employer';
}

export interface ITokenService {
  generateToken(payload: TokenPayload): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload>;
}

export const ITokenService = Symbol('ITokenService');
