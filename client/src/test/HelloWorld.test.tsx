import { describe, it, expect } from 'vitest';

describe('Hello World Tests', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true);
  });

  it('should greet with Hello World', () => {
    const greeting = 'Hello World!';
    expect(greeting).toBe('Hello World!');
  });
});
