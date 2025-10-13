import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ContainerSettings from './SettingsContainer';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the view component
jest.mock('../Views/SettingsView', () => ({
  __esModule: true,
  default: ({ onDatenschutzClick, onImpressumClick }: any) => (
    <div>
      <button 
        data-testid="datenschutz-button" 
        onClick={() => onDatenschutzClick(mockNavigate)}
      >
        Datenschutz
      </button>
      <button 
        data-testid="impressum-button" 
        onClick={() => onImpressumClick(mockNavigate)}
      >
        Impressum
      </button>
    </div>
  ),
}));

describe('SettingsContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ContainerSettings />
      </BrowserRouter>
    );
    expect(screen.getByTestId('datenschutz-button')).toBeInTheDocument();
    expect(screen.getByTestId('impressum-button')).toBeInTheDocument();
  });

  it('navigates to datenschutz page when button clicked', () => {
    render(
      <BrowserRouter>
        <ContainerSettings />
      </BrowserRouter>
    );
    
    const datenschutzButton = screen.getByTestId('datenschutz-button');
    fireEvent.click(datenschutzButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/datenschutz');
  });

  it('navigates to impressum page when button clicked', () => {
    render(
      <BrowserRouter>
        <ContainerSettings />
      </BrowserRouter>
    );
    
    const impressumButton = screen.getByTestId('impressum-button');
    fireEvent.click(impressumButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/impressum');
  });

  it('passes correct handlers to SettingsView', () => {
    render(
      <BrowserRouter>
        <ContainerSettings />
      </BrowserRouter>
    );
    
    // Test both handlers work correctly
    fireEvent.click(screen.getByTestId('datenschutz-button'));
    expect(mockNavigate).toHaveBeenCalledWith('/datenschutz');
    
    mockNavigate.mockClear();
    
    fireEvent.click(screen.getByTestId('impressum-button'));
    expect(mockNavigate).toHaveBeenCalledWith('/impressum');
  });
});
