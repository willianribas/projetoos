import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 py-4 text-center text-sm text-foreground/60">
      Copyright © {currentYear} Sistema OS. All rights reserved.
    </footer>
  );
};

export default Footer;