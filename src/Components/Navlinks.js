import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navlinks.module.css";

const NavLinks = ({ onLinkClick }) => {
  const pathname = usePathname();

  return (
    <nav className={styles.navlinks}>
      <a href="/cross-chain" onClick={onLinkClick}>
        <p
          className={pathname === "/cross-chain" ? styles.active : styles.text}
        >
          Cross Chain
        </p>
      </a>
      <a href="/same-chain" onClick={onLinkClick}>
        <p className={pathname === "/same-chain" ? styles.active : styles.text}>
          Same Chain
        </p>
      </a>
      <a href="/all-user-lists" onClick={onLinkClick}>
        <p
          className={
            pathname === "/all-user-lists" ? styles.active : styles.text
          }
        >
          Manage Label
        </p>
      </a>
      <a href="/transaction-analysis" onClick={onLinkClick}>
        <p
          className={
            pathname === "/transaction-analysis" ? styles.active : styles.text
          }
        >
          Transaction Analysis
        </p>
      </a>

      {/* <Link href="/cross-analysis">
        <p
          className={pathname === "/cross-analysis" ? styles.active : styles.text}
        >
          Cross Analysis
        </p>
   </a>
   <a href="/same-analysis">
        <p
          className={pathname === "/same-analysis" ? styles.active : styles.text}
        >
          Same Analysis
        </p>
   </a> */}
    </nav>
  );
};

export default NavLinks;
