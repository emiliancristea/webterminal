import { describe, it, expect } from 'vitest';
import { isGitHubPages, generateDemoOutput, demoPrompt, demoSessionId } from '@/lib/github-pages';

// Mock window.location for testing
const mockLocation = (hostname: string, pathname: string, protocol: string = 'https:', port: string = '') => {
  Object.defineProperty(window, 'location', {
    value: {
      hostname,
      pathname,
      protocol,
      port
    },
    writable: true
  });
};

describe('GitHub Pages utilities', () => {
  it('should detect GitHub Pages hosting', () => {
    // Test github.io domain
    mockLocation('username.github.io', '/repo/', 'https:');
    expect(isGitHubPages()).toBe(true);

    // Test webterminal path
    mockLocation('example.com', '/webterminal/', 'https:');
    expect(isGitHubPages()).toBe(true);

    // Test HTTPS without port (likely static hosting)
    mockLocation('example.com', '/', 'https:', '');
    expect(isGitHubPages()).toBe(true);

    // Test local development
    mockLocation('localhost', '/', 'http:', '3000');
    expect(isGitHubPages()).toBe(false);
  });

  it('should generate demo terminal output', () => {
    const output = generateDemoOutput();
    
    expect(output).toBeDefined();
    expect(output.length).toBeGreaterThan(0);
    
    // Should have alternating command and output entries
    expect(output[0].type).toBe('command');
    expect(output[1].type).toBe('output');
    
    // Should have proper structure
    expect(output[0]).toHaveProperty('id');
    expect(output[0]).toHaveProperty('content');
    expect(output[0]).toHaveProperty('timestamp');
  });

  it('should provide demo session data', () => {
    expect(demoPrompt).toEqual({
      user: 'demo',
      hostname: 'webterminal',
      directory: '~'
    });

    expect(demoSessionId).toBe('demo-session-github-pages');
  });
});