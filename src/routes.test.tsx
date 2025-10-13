import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { getRoutes } from './routes';

// Mock containers and components
jest.mock('./Container/QRGeneratorContainer', () => ({
  QRGeneratorContainer: () => <div data-testid="qr-generator">QR Generator</div>,
}));

jest.mock('./Container/QRReaderContainer', () => ({
  QRReaderContainer: () => <div data-testid="qr-reader">QR Reader</div>,
}));

jest.mock('./Container/SettingsContainer', () => ({
  __esModule: true,
  default: () => <div data-testid="settings">Settings</div>,
}));

jest.mock('./legal/impressum', () => ({
  __esModule: true,
  default: () => <div data-testid="impressum">Impressum</div>,
}));

jest.mock('./legal/datenschutz', () => ({
  __esModule: true,
  default: () => <div data-testid="datenschutz">Datenschutz</div>,
}));

describe('routes', () => {
  it('renders QRGeneratorContainer on home route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        {getRoutes()}
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('qr-generator')).toBeInTheDocument();
  });

  it('renders QRReaderContainer on reader route', () => {
    render(
      <MemoryRouter initialEntries={['/reader']}>
        {getRoutes()}
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('qr-reader')).toBeInTheDocument();
  });

  it('renders Impressum on impressum route', () => {
    render(
      <MemoryRouter initialEntries={['/impressum']}>
        {getRoutes()}
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('impressum')).toBeInTheDocument();
  });

  it('renders Datenschutz on datenschutz route', () => {
    render(
      <MemoryRouter initialEntries={['/datenschutz']}>
        {getRoutes()}
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('datenschutz')).toBeInTheDocument();
  });

  it('renders Settings on info route', () => {
    render(
      <MemoryRouter initialEntries={['/info']}>
        {getRoutes()}
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('settings')).toBeInTheDocument();
  });
});
