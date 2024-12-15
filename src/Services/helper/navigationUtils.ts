import { useSwipeable } from "react-swipeable";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

interface NavLink {
  path: string;
  component: string;
}

interface UseSwipeNavigationProps {
  navLinks: NavLink[];
  activeComponent: string;
  setActiveComponent: (component: string) => void;
  enable: boolean;
  onEnd?: () => void; // Optionale Methode hinzufügen
}

export const useSwipeNavigation = ({
  navLinks,
  activeComponent,
  setActiveComponent,
  enable,
  onEnd,
}: UseSwipeNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const nextLink = () => {
    const currentIndex = navLinks.findIndex(
      (link) => link.component === activeComponent
    );
    if (currentIndex < navLinks.length - 1) {
      const nextLink = navLinks[currentIndex + 1];
      setActiveComponent(nextLink.component);
      navigate(nextLink.path);
    } else if (onEnd) {
      onEnd(); // Optionales Callback aufrufen, wenn der letzte Screen erreicht ist
    }
  };

  const prevLink = () => {
    const currentIndex = navLinks.findIndex(
      (link) => link.component === activeComponent
    );
    if (currentIndex > 0) {
      const previousLink = navLinks[currentIndex - 1];
      setActiveComponent(previousLink.component);
      navigate(previousLink.path);
    }
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: enable ? () => nextLink() : undefined,
    onSwipedRight: enable ? () => prevLink() : undefined,
    trackMouse: true,
  });

  // Keyboard navigation logic
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (enable && !location.pathname.includes('Start')) {
        const currentIndex = navLinks.findIndex(link => link.component === activeComponent);

        if (event.key === 'ArrowLeft' && currentIndex > 0) {
          // Move to the previous link
          const previousLink = navLinks[currentIndex - 1];
          setActiveComponent(previousLink.component);
          navigate(previousLink.path);
        } else if (event.key === 'ArrowRight' && currentIndex < navLinks.length - 1) {
          // Move to the next link
          const nextLink = navLinks[currentIndex + 1];
          setActiveComponent(nextLink.component);
          navigate(nextLink.path);
        } else if (event.key === 'ArrowRight' && currentIndex === navLinks.length - 1 && onEnd) {
          // Call optional onEnd callback when the last screen is reached
          onEnd();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeComponent, location, navigate, setActiveComponent, navLinks, enable, onEnd]);

  return handlers;
};