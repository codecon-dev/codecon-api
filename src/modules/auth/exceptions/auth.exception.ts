export class AuthenticationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationException';
  }
}
