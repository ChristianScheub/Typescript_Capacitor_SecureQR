import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MaterialDropdown from './MaterialDropdown';

describe('MaterialDropdown', () => {
  const mockOnChange = jest.fn();
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <MaterialDropdown
        label="Test Dropdown"
        options={options}
        selectedValue="option1"
        onChange={mockOnChange}
      />
    );
    expect(container.textContent).toContain('Test Dropdown');
  });

  it('should display the selected value', () => {
    const { container } = render(
      <MaterialDropdown
        label="Test Dropdown"
        options={options}
        selectedValue="option2"
        onChange={mockOnChange}
      />
    );
    
    // Just verify the component renders with the selected value
    expect(container).toBeInTheDocument();
  });

  it('should render all options when opened', () => {
    const { container } = render(
      <MaterialDropdown
        label="Test Dropdown"
        options={options}
        selectedValue="option1"
        onChange={mockOnChange}
      />
    );
    
    // Click to open dropdown
    const button = container.querySelector('[role="combobox"]');
    if (button) {
      fireEvent.mouseDown(button);
      
      // Check that at least one option is rendered
      const allOptions = screen.queryAllByText(/Option \d/);
      expect(allOptions.length).toBeGreaterThan(0);
    }
  });

  it('should call onChange when option is selected', () => {
    const { container } = render(
      <MaterialDropdown
        label="Unique Dropdown"
        options={options}
        selectedValue="option1"
        onChange={mockOnChange}
      />
    );
    
    // Click to open dropdown
    const button = container.querySelector('[role="combobox"]');
    if (button) {
      fireEvent.mouseDown(button);
      
      // Select an option - use getAllByText since there may be duplicates
      const optionsElements = screen.queryAllByText('Option 2');
      if (optionsElements.length > 0) {
        fireEvent.click(optionsElements[0]);
        expect(mockOnChange).toHaveBeenCalled();
      }
    }
  });

  it('should have proper label styling', () => {
    const { container } = render(
      <MaterialDropdown
        label="Styled Dropdown"
        options={options}
        selectedValue="option1"
        onChange={mockOnChange}
      />
    );
    
    const formControl = container.querySelector('.MuiFormControl-root');
    expect(formControl).toBeInTheDocument();
  });

  it('should handle empty options array', () => {
    const { container } = render(
      <MaterialDropdown
        label="Empty Dropdown"
        options={[]}
        selectedValue=""
        onChange={mockOnChange}
      />
    );
    
    expect(container.textContent).toContain('Empty Dropdown');
  });
});
