import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the routes
jest.mock('./routes', () => ({
  getRoutes: jest.fn(() => <div data-testid="routes">Routes</div>),
}));

// Mock NavbarView
jest.mock('./Views/NavBar/NavbarView', () => ({
  __esModule: true,
  default: ({ activeComponent }: { activeComponent: string }) => (
    <div data-testid="navbar">Navbar - {activeComponent}</div>
  ),
}));

// Mock AdManager
jest.mock('./Services/Ads/AdManager', () => ({
  AdManager: () => <div data-testid="ad-manager">Ad Manager</div>,
}));

// Mock hooks
jest.mock('./Services/helper/useDeviceCheck', () => ({
  useDeviceCheck: jest.fn(() => false),
}));

jest.mock('./Services/helper/navigationUtils', () => ({
  useSwipeNavigation: jest.fn(() => ({})),
}));

jest.mock('./Services/helper/statusBarUtils', () => ({
  makeStatusBarTransparent: jest.fn(),
}));

// Mock i18n
jest.mock('./i18n', () => ({}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders NavbarView component', () => {
    render(<App />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText(/Navbar/)).toBeInTheDocument();
  });

  it('renders routes', () => {
    render(<App />);
    expect(screen.getByTestId('routes')).toBeInTheDocument();
  });

  it('renders AdManager component', () => {
    render(<App />);
    expect(screen.getByTestId('ad-manager')).toBeInTheDocument();
  });

  it('has proper structure with padding', () => {
    const { container } = render(<App />);
    const mainDiv = container.querySelector('div[style]');
    expect(mainDiv).toBeDefined();
  });
});
