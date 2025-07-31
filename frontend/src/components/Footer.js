import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p>&copy; {currentYear} CommendAI. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;