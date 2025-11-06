import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MaterialInput from './MaterialInput';

describe('MaterialInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(<MaterialInput value="" onChange={mockOnChange} />);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('should display the provided value', () => {
    const { container } = render(<MaterialInput value="test value" onChange={mockOnChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('should call onChange when input changes', () => {
    const { container } = render(<MaterialInput value="" onChange={mockOnChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should render with label', () => {
    const { container } = render(<MaterialInput value="" onChange={mockOnChange} label="Test Label" />);
    expect(container.textContent).toContain('Test Label');
  });

  it('should render with helper text', () => {
    const { container } = render(<MaterialInput value="" onChange={mockOnChange} helperText="Helper text" />);
    expect(container.textContent).toContain('Helper text');
  });

  it('should render with placeholder', () => {
    const { container } = render(<MaterialInput value="" onChange={mockOnChange} placeholder="Enter text" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  it('should handle different input types', () => {
    const { container } = render(<MaterialInput value="" onChange={mockOnChange} type="password" />);
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should handle null value', () => {
    const { container } = render(<MaterialInput value={null} onChange={mockOnChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('should handle number value', () => {
    const { container } = render(<MaterialInput value={123} onChange={mockOnChange} />);
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('123');
  });
});
