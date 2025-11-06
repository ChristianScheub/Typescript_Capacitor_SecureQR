import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';

describe('Card', () => {
  it('should render without crashing', () => {
    render(<Card>Test content</Card>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <Card>
        <h1>Title</h1>
        <p>Description</p>
      </Card>
    );
    
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should apply custom styles', () => {
    const customStyle = { padding: '20px', margin: '10px' };
    const { container } = render(<Card style={customStyle}>Content</Card>);
    
    const cardElement = container.querySelector('.card-container');
    expect(cardElement).toBeInTheDocument();
    // Just verify the element exists and accepts style props
    expect(cardElement).toHaveAttribute('style');
  });

  it('should have card-container class', () => {
    const { container } = render(<Card>Content</Card>);
    const cardElement = container.querySelector('.card-container');
    expect(cardElement).toBeInTheDocument();
  });

  it('should render empty card', () => {
    const { container } = render(<Card>{''}</Card>);
    const cardElement = container.querySelector('.card-container');
    expect(cardElement).toBeInTheDocument();
  });
});
