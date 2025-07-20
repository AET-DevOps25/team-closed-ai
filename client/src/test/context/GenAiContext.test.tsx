import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GenAiProvider, useGenAi, type ChatMessage, type UserChatMessage, type AiChatMessage } from '@/context/GenAiContext';
import type { GenAIResponse, PromptRequest } from '@/api/genai/api';

// Mock console.error
const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock the useGenAiApi hook
const mockGenAiApi = {
  response: {
    data: null as GenAIResponse | null,
    loading: false,
    error: null as string | null,
  },
  health: {
    data: null as string | null,
    loading: false,
    error: null as string | null,
  },
  createPrompt: vi.fn(),
  clearErrors: vi.fn(),
};

vi.mock('@/hooks/use-genai-api', () => ({
  useGenAiApi: () => mockGenAiApi,
}));

// Test component to access context
const TestComponent = () => {
  const context = useGenAi();
  return (
    <div>
      <div data-testid="chat-history-count">{context.chatHistory.length}</div>
      <div data-testid="response-loading">{context.response.loading.toString()}</div>
      <div data-testid="response-error">{context.response.error || 'None'}</div>
      <div data-testid="health-data">{context.health.data || 'None'}</div>
      <div data-testid="chat-messages">
        {context.chatHistory.map((msg, index) => (
          <div key={msg.id} data-testid={`message-${index}`}>
            {msg.type}: {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
          </div>
        ))}
      </div>
      <button onClick={() => {
        const messageId = context.addUserMessage({ project_id: '1', prompt: 'Test prompt', user_id: '1' });
        console.log('Added user message:', messageId);
      }}>
        Add User Message
      </button>
      <button onClick={() => {
        context.addAiMessage({ intent: 'test', answer: 'Test AI response' });
      }}>
        Add AI Message
      </button>
      <button onClick={() => context.clearChatHistory()}>
        Clear History
      </button>
      <button onClick={() => context.sendMessage({ project_id: '1', prompt: 'Send prompt', user_id: '1' })}>
        Send Message
      </button>
    </div>
  );
};

describe('GenAiContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock state
    mockGenAiApi.response.data = null;
    mockGenAiApi.response.loading = false;
    mockGenAiApi.response.error = null;
    mockGenAiApi.health.data = null;
    mockGenAiApi.health.loading = false;
    mockGenAiApi.health.error = null;
  });

  afterEach(() => {
    consoleErrorMock.mockClear();
  });

  it('should provide default context values', () => {
    render(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    expect(screen.getByTestId('chat-history-count')).toHaveTextContent('0');
    expect(screen.getByTestId('response-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('response-error')).toHaveTextContent('None');
    expect(screen.getByTestId('health-data')).toHaveTextContent('None');
  });

  it('should add user message to chat history', async () => {
    render(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    await act(async () => {
      screen.getByText('Add User Message').click();
    });

    expect(screen.getByTestId('chat-history-count')).toHaveTextContent('1');
    expect(screen.getByTestId('message-0')).toHaveTextContent('user: {"project_id":"1","prompt":"Test prompt","user_id":"1"}');
  });

  it('should add AI message to chat history', async () => {
    render(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    await act(async () => {
      screen.getByText('Add AI Message').click();
    });

    expect(screen.getByTestId('chat-history-count')).toHaveTextContent('1');
    expect(screen.getByTestId('message-0')).toHaveTextContent('ai: {"intent":"test","answer":"Test AI response"}');
  });

  it('should add multiple messages in correct order', async () => {
    render(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    await act(async () => {
      screen.getByText('Add User Message').click();
    });

    await act(async () => {
      screen.getByText('Add AI Message').click();
    });

    expect(screen.getByTestId('chat-history-count')).toHaveTextContent('2');
    expect(screen.getByTestId('message-0')).toHaveTextContent('user:');
    expect(screen.getByTestId('message-1')).toHaveTextContent('ai:');
  });

  it('should clear chat history', async () => {
    render(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    // Add some messages first
    await act(async () => {
      screen.getByText('Add User Message').click();
    });

    await act(async () => {
      screen.getByText('Add AI Message').click();
    });

    expect(screen.getByTestId('chat-history-count')).toHaveTextContent('2');

    // Clear history
    await act(async () => {
      screen.getByText('Clear History').click();
    });

    expect(screen.getByTestId('chat-history-count')).toHaveTextContent('0');
    expect(mockGenAiApi.clearErrors).toHaveBeenCalled();
  });

  it('should send message and add to chat history', async () => {
    mockGenAiApi.createPrompt.mockResolvedValue(undefined);

    render(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    await act(async () => {
      screen.getByText('Send Message').click();
    });

    expect(screen.getByTestId('chat-history-count')).toHaveTextContent('1');
    expect(screen.getByTestId('message-0')).toHaveTextContent('user: {"project_id":"1","prompt":"Send prompt","user_id":"1"}');
    expect(mockGenAiApi.createPrompt).toHaveBeenCalledWith({
      project_id: '1',
      prompt: 'Send prompt',
      user_id: '1',
    });
  });

  it('should handle send message error gracefully', async () => {
    const testError = new Error('API Error');
    mockGenAiApi.createPrompt.mockRejectedValue(testError);

    render(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    await act(async () => {
      screen.getByText('Send Message').click();
    });

    expect(screen.getByTestId('chat-history-count')).toHaveTextContent('1'); // User message still added
    expect(consoleErrorMock).toHaveBeenCalledWith('Error sending message:', testError);
  });

  it('should automatically add AI message when API response data changes', async () => {
    const testResponse: GenAIResponse = {
      intent: 'help',
      answer: 'Automatic AI response',
    };

    const { rerender } = render(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    // Simulate API response data update
    act(() => {
      mockGenAiApi.response.data = testResponse;
    });

    rerender(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('chat-history-count')).toHaveTextContent('1');
      expect(screen.getByTestId('message-0')).toHaveTextContent('ai: {"intent":"help","answer":"Automatic AI response"}');
    });
  });

  it('should not add duplicate AI messages for same response data', async () => {
    const testResponse: GenAIResponse = {
      intent: 'help',
      answer: 'Same response',
    };

    const { rerender } = render(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    // First response
    act(() => {
      mockGenAiApi.response.data = testResponse;
    });

    rerender(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('chat-history-count')).toHaveTextContent('1');
    });

    // Same response again - should not add duplicate
    rerender(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    expect(screen.getByTestId('chat-history-count')).toHaveTextContent('1');
  });

  it('should add new AI message when response data changes to different content', async () => {
    const firstResponse: GenAIResponse = {
      intent: 'help',
      answer: 'First response',
    };

    const secondResponse: GenAIResponse = {
      intent: 'help',
      answer: 'Second response',
    };

    const { rerender } = render(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    // First response
    act(() => {
      mockGenAiApi.response.data = firstResponse;
    });

    rerender(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('chat-history-count')).toHaveTextContent('1');
    });

    // Second response
    act(() => {
      mockGenAiApi.response.data = secondResponse;
    });

    rerender(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('chat-history-count')).toHaveTextContent('2');
    });
  });

  it('should reflect API loading state', () => {
    mockGenAiApi.response.loading = true;

    render(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    expect(screen.getByTestId('response-loading')).toHaveTextContent('true');
  });

  it('should reflect API error state', () => {
    mockGenAiApi.response.error = 'API Error';

    render(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    expect(screen.getByTestId('response-error')).toHaveTextContent('API Error');
  });

  it('should reflect health data', () => {
    mockGenAiApi.health.data = 'Healthy';

    render(
      <GenAiProvider>
        <TestComponent />
      </GenAiProvider>
    );

    expect(screen.getByTestId('health-data')).toHaveTextContent('Healthy');
  });

  it('should return unique message IDs for user messages', async () => {
    let messageId1: string = '';
    let messageId2: string = '';

    const TestUniqueIdComponent = () => {
      const { addUserMessage } = useGenAi();
      return (
        <div>
          <button onClick={() => {
            messageId1 = addUserMessage({ project_id: '1', prompt: 'First', user_id: '1' });
          }}>
            Add First
          </button>
          <button onClick={() => {
            messageId2 = addUserMessage({ project_id: '1', prompt: 'Second', user_id: '1' });
          }}>
            Add Second
          </button>
        </div>
      );
    };

    render(
      <GenAiProvider>
        <TestUniqueIdComponent />
      </GenAiProvider>
    );

    await act(async () => {
      screen.getByText('Add First').click();
    });

    await act(async () => {
      screen.getByText('Add Second').click();
    });

    expect(messageId1).toBeTruthy();
    expect(messageId2).toBeTruthy();
    expect(messageId1).not.toBe(messageId2);
    expect(messageId1).toContain('user-');
    expect(messageId2).toContain('user-');
  });

  it('should throw error when used outside provider', () => {
    const TestComponentOutsideProvider = () => {
      useGenAi();
      return <div>Test</div>;
    };

    expect(() => {
      render(<TestComponentOutsideProvider />);
    }).toThrow('useGenAi must be used within a GenAiProvider');
  });
});
