// components/Navbar.tsx
import Link from 'next/link';
import styles from './navbar.module.css'; // Import your CSS module

const Navbar = () => {
  return (
    <nav className={`${styles.navbar}`}>
      <div className="flex items-center justify-between">
        <div className={styles.logo}>
          <img 
            src="/paltu_logo.svg" 
            alt="Logo" 
            width={200}   // Set desired width
            height={200}  // Set desired height
          />
        </div>
        <div className={`${styles.navLinks} flex items-center gap-5`}>
        <Link href="/browse-pets">
            <span className="hover:text-[#ffd2e3] cursor-pointer">Browse Pets</span>
          </Link>
        <Link href="/foster-pets">
            <span className="hover:text-[#ffd2e3] cursor-pointer">Foster Pets</span>
          </Link>
          <Link href="/pet-care">
            <span className="hover:text-[#ffd2e3] cursor-pointer">Pet Care</span>
          </Link>
          <Link href="/llm">
            <span className="hover:text-[#ffd2e3] cursor-pointer">LLM</span>
          </Link>
          <Link href="/about-us">
            <span className="hover:text-[#ffd2e3] cursor-pointer">About Us</span>
          </Link>
          <Link href="/login">
            <button className={`${styles.loginBtn} hover:bg-[#ffd2e3] hover:text-[#70223f]`}>
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
