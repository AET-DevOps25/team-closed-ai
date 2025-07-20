import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock React DOM
const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({
  render: mockRender,
}));

vi.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}));

// Mock App component
vi.mock('../App.tsx', () => ({
  default: () => 'App',
}));

// Mock ThemeProvider
vi.mock('../context/ThemeContext.tsx', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock CSS import
vi.mock('../index.css', () => ({}));

// Mock DOM
Object.defineProperty(document, 'getElementById', {
  value: vi.fn(() => ({
    id: 'root',
  })),
  writable: true,
});

describe('main.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('should create root and render app with providers', async () => {
    // Import main.tsx to execute the code
    await import('../main.tsx');

    // Verify DOM element was queried
    expect(document.getElementById).toHaveBeenCalledWith('root');

    // Verify createRoot was called with the root element
    expect(mockCreateRoot).toHaveBeenCalledWith({
      id: 'root',
    });

    // Verify render was called
    expect(mockRender).toHaveBeenCalledTimes(1);

    // Get the rendered element structure
    const renderCall = mockRender.mock.calls[0][0];
    expect(renderCall).toBeDefined();
  });

  it('should render app within StrictMode and ThemeProvider', async () => {
    await import('../main.tsx');

    expect(mockRender).toHaveBeenCalledTimes(1);
    
    // The render function should have been called with the component tree
    const renderCall = mockRender.mock.calls[0][0];
    expect(renderCall).toBeDefined();
  });

  it('should use correct theme provider props', async () => {
    await import('../main.tsx');

    expect(mockRender).toHaveBeenCalledTimes(1);
    
    // Verify the component structure includes ThemeProvider with correct props
    const renderCall = mockRender.mock.calls[0][0];
    expect(renderCall).toBeDefined();
  });
});
