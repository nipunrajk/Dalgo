import { describe, it, expect, beforeAll } from 'vitest';
import { signToken, verifyToken } from '../utils/jwt.js';

describe('JWT Utils', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
  });

  it('should sign a token with payload', () => {
    const payload = { userId: '123', email: 'test@example.com' };
    const token = signToken(payload);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should verify a valid token', () => {
    const payload = { userId: '123', email: 'test@example.com' };
    const token = signToken(payload);
    const decoded = verifyToken(token);

    expect(decoded).toBeDefined();
    expect(decoded.userId).toBe('123');
    expect(decoded.email).toBe('test@example.com');
  });

  it('should return null for invalid token', () => {
    const decoded = verifyToken('invalid_token');
    expect(decoded).toBeNull();
  });

  it('should return null for expired token', () => {
    const decoded = verifyToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTAyMn0.invalid'
    );
    expect(decoded).toBeNull();
  });
});
