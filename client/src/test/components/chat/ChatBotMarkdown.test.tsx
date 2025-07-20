import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatBotMarkdown from '@/components/chat/ChatBotMarkdown';
import { useBoard } from '@/context/BoardContext';

// Mock the dependencies
vi.mock('@/context/BoardContext');
vi.mock('react-markdown', () => ({
  default: ({ children, components }: { children: string; components: any }) => {
    // Simple mock that renders markdown components for testing
    const { p, strong, em, ul, ol, li, code, pre, blockquote, h1, h2, h3 } = components;
    
    // Test different markdown patterns
    if (children.includes('[id:123]')) {
      return p({ children: children });
    }
    if (children.includes('**bold**')) {
      return strong({ children: 'bold' });
    }
    if (children.includes('*italic*')) {
      return em({ children: 'italic' });
    }
    if (children.includes('- item')) {
      return ul({ children: li({ children: 'item' }) });
    }
    if (children.includes('1. item')) {
      return ol({ children: li({ children: 'item' }) });
    }
    if (children.includes('`code`')) {
      return code({ children: 'code' });
    }
    if (children.includes('```')) {
      return pre({ children: 'code block' });
    }
    if (children.includes('> quote')) {
      return blockquote({ children: 'quote' });
    }
    if (children.includes('# H1')) {
      return h1({ children: 'H1' });
    }
    if (children.includes('## H2')) {
      return h2({ children: 'H2' });
    }
    if (children.includes('### H3')) {
      return h3({ children: 'H3' });
    }
    
    return <div data-testid="markdown-content">{children}</div>;
  },
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, variant }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    className?: string;
    variant?: string;
  }) => (
    <button 
      onClick={onClick} 
      className={className} 
      data-variant={variant}
      data-testid="task-button"
    >
      {children}
    </button>
  ),
}));

describe('ChatBotMarkdown', () => {
  const mockOpenTaskDetails = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useBoard as any).mockReturnValue({
      openTaskDetails: mockOpenTaskDetails,
    });
  });

  it('should render basic markdown content', () => {
    render(<ChatBotMarkdown message="Hello world" />);
    
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('should render task links and handle clicks', () => {
    render(<ChatBotMarkdown message="Check task [id:123] for details" />);
    
    const taskButton = screen.getByTestId('task-button');
    expect(taskButton).toBeInTheDocument();
    expect(taskButton).toHaveTextContent('[id:123]');
    
    fireEvent.click(taskButton);
    expect(mockOpenTaskDetails).toHaveBeenCalledWith(123);
  });

  it('should render bold text', () => {
    render(<ChatBotMarkdown message="**bold**" />);
    
    expect(screen.getByText('bold')).toBeInTheDocument();
  });

  it('should render italic text', () => {
    render(<ChatBotMarkdown message="*italic*" />);
    
    expect(screen.getByText('italic')).toBeInTheDocument();
  });

  it('should render unordered lists', () => {
    render(<ChatBotMarkdown message="- item" />);
    
    expect(screen.getByText('item')).toBeInTheDocument();
  });

  it('should render ordered lists', () => {
    render(<ChatBotMarkdown message="1. item" />);
    
    expect(screen.getByText('item')).toBeInTheDocument();
  });

  it('should render inline code', () => {
    render(<ChatBotMarkdown message="`code`" />);
    
    expect(screen.getByText('code')).toBeInTheDocument();
  });

  it('should render code blocks', () => {
    render(<ChatBotMarkdown message="```\ncode block\n```" />);
    
    expect(screen.getByText('code block')).toBeInTheDocument();
  });

  it('should render blockquotes', () => {
    render(<ChatBotMarkdown message="> quote" />);
    
    expect(screen.getByText('quote')).toBeInTheDocument();
  });

  it('should render headings H1', () => {
    render(<ChatBotMarkdown message="# H1" />);
    
    expect(screen.getByText('H1')).toBeInTheDocument();
  });

  it('should render headings H2', () => {
    render(<ChatBotMarkdown message="## H2" />);
    
    expect(screen.getByText('H2')).toBeInTheDocument();
  });

  it('should render headings H3', () => {
    render(<ChatBotMarkdown message="### H3" />);
    
    expect(screen.getByText('H3')).toBeInTheDocument();
  });

  it('should handle multiple task references in one message', () => {
    render(<ChatBotMarkdown message="Check tasks [id:123] and [id:456]" />);
    
    const taskButtons = screen.getAllByTestId('task-button');
    expect(taskButtons).toHaveLength(2);
    
    fireEvent.click(taskButtons[0]);
    expect(mockOpenTaskDetails).toHaveBeenCalledWith(123);
    
    fireEvent.click(taskButtons[1]);
    expect(mockOpenTaskDetails).toHaveBeenCalledWith(456);
  });

  it('should handle empty message', () => {
    render(<ChatBotMarkdown message="" />);
    
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
  });
});
