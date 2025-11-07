export class AuthException extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'AuthException';
  }
}

export class InvalidCredentialsException extends AuthException {
  constructor() {
    super(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }
}

export class UserAlreadyExistsException extends AuthException {
  constructor(email: string) {
    super(409, `User with email ${email} already exists`, 'USER_ALREADY_EXISTS');
  }
}

export class UserNotFoundException extends AuthException {
  constructor(userId: string) {
    super(404, `User with ID ${userId} not found`, 'USER_NOT_FOUND');
  }
}

export class InvalidTokenException extends AuthException {
  constructor() {
    super(401, 'Invalid or expired token', 'INVALID_TOKEN');
  }
}
