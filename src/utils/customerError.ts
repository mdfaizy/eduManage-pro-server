interface IFormattedError {
  status: number;
  errors: { message: string }[];
}

export class CustomError extends Error implements IFormattedError{
  public status: number;
  public errors: { message: string }[];

  constructor(message: string, status: number) {
    super(typeof message === 'string' ? message : 'An error occurred');
    this.status = status;
    this.name = 'CustomError';
    this.errors = [
      {
        message: this.message,
      },
    ]; // Automatically format error response
  }
}

export class TokenExpiredError extends CustomError {
  constructor() {
    super('Token has expired.', 401);
    this.name = 'TokenExpiredError';
  }
}

export class InvalidTokenError extends CustomError {
  constructor() {
    super('Invalid JWT token.', 401);
    this.name = 'InvalidTokenError';
  }
}
