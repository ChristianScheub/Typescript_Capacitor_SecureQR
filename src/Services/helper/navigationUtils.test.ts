/* eslint-disable @typescript-eslint/no-require-imports */
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useSwipeNavigation } from './navigationUtils';
import React from 'react';

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockLocation = { pathname: '/' };

jest.mock('react-router-dom', () => {
  const React = require('react');
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
  };
});

describe('navigationUtils', () => {
  const navLinks = [
    { path: '/', component: 'home' },
    { path: '/reader', component: 'reader' },
    { path: '/info', component: 'info' }
  ];

  const mockSetActiveComponent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useSwipeNavigation', () => {
    it('should return swipeable handlers', () => {
      const { result } = renderHook(() => 
        useSwipeNavigation({
          navLinks,
          activeComponent: 'home',
          setActiveComponent: mockSetActiveComponent,
          enable: true,
        }),
        { wrapper: BrowserRouter }
      );

      expect(result.current).toBeDefined();
      expect(result.current.ref).toBeDefined();
    });

    it('should navigate to next link on right arrow key', () => {
      renderHook(() => 
        useSwipeNavigation({
          navLinks,
          activeComponent: 'home',
          setActiveComponent: mockSetActiveComponent,
          enable: true,
        }),
        { wrapper: BrowserRouter }
      );

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        window.dispatchEvent(event);
      });

      expect(mockSetActiveComponent).toHaveBeenCalledWith('reader');
      expect(mockNavigate).toHaveBeenCalledWith('/reader');
    });

    it('should navigate to previous link on left arrow key', () => {
      renderHook(() => 
        useSwipeNavigation({
          navLinks,
          activeComponent: 'reader',
          setActiveComponent: mockSetActiveComponent,
          enable: true,
        }),
        { wrapper: BrowserRouter }
      );

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        window.dispatchEvent(event);
      });

      expect(mockSetActiveComponent).toHaveBeenCalledWith('home');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should not navigate beyond first link', () => {
      renderHook(() => 
        useSwipeNavigation({
          navLinks,
          activeComponent: 'home',
          setActiveComponent: mockSetActiveComponent,
          enable: true,
        }),
        { wrapper: BrowserRouter }
      );

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        window.dispatchEvent(event);
      });

      expect(mockSetActiveComponent).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should call onEnd when navigating beyond last link', () => {
      const mockOnEnd = jest.fn();
      
      renderHook(() => 
        useSwipeNavigation({
          navLinks,
          activeComponent: 'info',
          setActiveComponent: mockSetActiveComponent,
          enable: true,
          onEnd: mockOnEnd,
        }),
        { wrapper: BrowserRouter }
      );

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        window.dispatchEvent(event);
      });

      expect(mockOnEnd).toHaveBeenCalled();
    });

    it('should not navigate when enable is false', () => {
      renderHook(() => 
        useSwipeNavigation({
          navLinks,
          activeComponent: 'home',
          setActiveComponent: mockSetActiveComponent,
          enable: false,
        }),
        { wrapper: BrowserRouter }
      );

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        window.dispatchEvent(event);
      });

      expect(mockSetActiveComponent).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should clean up event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { unmount } = renderHook(() => 
        useSwipeNavigation({
          navLinks,
          activeComponent: 'home',
          setActiveComponent: mockSetActiveComponent,
          enable: true,
        }),
        { wrapper: BrowserRouter }
      );
      
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });
});
