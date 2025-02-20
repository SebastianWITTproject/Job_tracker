import React from 'react';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <p>Made by</p>
      <div className="github-info">
        <FaGithub size={20} />
        <span>@SebastianWITTproject</span>
      </div>
    </footer>
  );
};

export default Footer;
