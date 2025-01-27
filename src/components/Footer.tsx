import React from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-4 mt-8 border-t">
      <div className="container mx-auto text-center text-sm text-gray-500">
        <p>Copyright © {currentYear} Sistema OS. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;