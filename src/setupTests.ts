/* eslint-disable @typescript-eslint/no-require-imports */
import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for jsdom
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock Capacitor modules
jest.mock('@capacitor/core', () => ({
  Capacitor: {
    getPlatform: jest.fn(() => 'web'),
    isNativePlatform: jest.fn(() => false),
  },
}));

jest.mock('@capacitor/status-bar', () => ({
  StatusBar: {
    setOverlaysWebView: jest.fn(),
    setBackgroundColor: jest.fn(),
    setStyle: jest.fn(),
  },
  Style: {
    Dark: 'DARK',
    Light: 'LIGHT',
  },
}));

jest.mock('@capacitor/filesystem', () => ({
  Filesystem: {
    writeFile: jest.fn(),
    getUri: jest.fn(),
  },
  Directory: {
    Documents: 'DOCUMENTS',
  },
}));

jest.mock('@capacitor/share', () => ({
  Share: {
    share: jest.fn(),
  },
}));

// Mock AdMob
jest.mock('@capacitor-community/admob', () => ({
  AdMob: {
    initialize: jest.fn(),
    showBanner: jest.fn(),
    hideBanner: jest.fn(),
    showInterstitial: jest.fn(),
    prepareInterstitial: jest.fn(),
  },
  BannerAdSize: {
    BANNER: 'BANNER',
  },
  BannerAdPosition: {
    BOTTOM_CENTER: 'BOTTOM_CENTER',
  },
}));

// Mock window.alert and window.prompt
global.alert = jest.fn();
global.prompt = jest.fn();

// Suppress console errors in tests
global.console.error = jest.fn();
global.console.warn = jest.fn();
