import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navlinks.module.css";

const NavLinks = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.navlinks}>
      <Link href="/cross-chain">
        <p
          className={pathname === "/cross-chain" ? styles.active : styles.text}
        >
          Cross Chain
        </p>
      </Link>
      <Link href="/same-chain">
        <p
          className={pathname === "/same-chain" ? styles.active : styles.text}
        >
          Same Chain
        </p>
      </Link>
      <Link href="/all-user-lists">
        <p
          className={pathname === "/all-user-lists" ? styles.active : styles.text}
        >
          Manage Label
        </p>
      </Link>
      <Link href="/transaction-analysis">
        <p
          className={pathname === "/transaction-analysis" ? styles.active : styles.text}
        >
          Transaction Analysis
        </p>
      </Link>

      {/* <Link href="/cross-analysis">
        <p
          className={pathname === "/cross-analysis" ? styles.active : styles.text}
        >
          Cross Analysis
        </p>
      </Link>
      <Link href="/same-analysis">
        <p
          className={pathname === "/same-analysis" ? styles.active : styles.text}
        >
          Same Analysis
        </p>
      </Link> */}
    </nav>
  );
};

export default NavLinks;
