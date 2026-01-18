import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer-style">
      <p>© {new Date().getFullYear()} My Website</p>
      <ul>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </footer>
  );
}