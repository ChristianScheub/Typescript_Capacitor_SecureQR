import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import { MdInfoOutline } from "react-icons/md";
import './Navbar.css';
import { Navbar } from "react-bootstrap";
import { Capacitor } from '@capacitor/core';
import { BiBarcodeReader } from 'react-icons/bi';

interface NavbarViewProps {
  setActiveComponent: (component: string) => void;
  activeComponent: string;
}

const NavbarView: React.FC<NavbarViewProps> = ({ setActiveComponent, activeComponent }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isNativeApp = Capacitor.getPlatform() !== 'web';


  const navLinks = useMemo(() => [
    { path: '/', component: 'home', icon: <FaHome size={30} />, key: 'home' },
    { path: '/reader', component: 'reader', icon: <BiBarcodeReader size={30} />, key: 'reader' },
    { path: '/info', component: 'info', icon: <MdInfoOutline size={30} />, key: 'info' }
  ], []);

  React.useEffect(() => {
    const pathToComponentMap: Record<string, string> = {
      '/': 'home',
      '/reader': 'reader',
      '/government': 'info',
      '/salary': 'info',
      '/info': 'info',
      '/impressum': 'info',
      '/datenschutz': 'info',
    };
    setActiveComponent(pathToComponentMap[location.pathname] || 'home');
  }, [location, setActiveComponent]);

  const getColor = (component: string) => (activeComponent === component ? '#66B0B0' : '#ffffff');

  return (
    <div className={isNativeApp ? 'nativeApp' : ''}>

    <Navbar
    variant="dark"
    className="navbarElement width100 shadow"
  >
    <div className="navbarContainer">
      {location.pathname.includes('Start') && (
        <Link to="/" className="icon" onClick={() => navigate(-1)}>
          <FaArrowLeft size={30} color={"#ffffff"} />
        </Link>
      )}
      {!location.pathname.includes('Start') && (
        <>
          {navLinks.map((link) => (
            <Link
              to={link.path}
              className="icon"
              onClick={() => setActiveComponent(link.component)}
              key={link.key}
            >
              {React.cloneElement(link.icon, { color: getColor(link.component) })}
            </Link>
          ))}
        </>
      )}
    </div>
    </Navbar>
    </div>
  );
};

export default NavbarView;