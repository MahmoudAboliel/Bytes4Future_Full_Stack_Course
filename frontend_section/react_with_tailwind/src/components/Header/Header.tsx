import styles from "./Header.module.css";
const Header = () => {
  return (
    <header className={styles.head}>
      <a className={styles.link} href="#">
        MD
      </a>
      <ul className={styles.ul}>
        <li className={`${styles.li}`}>
          <a href="#">Home</a>
        </li>
        <li className={styles.li}>
          <a href="#">Users</a>
        </li>
        <li className={styles.li}>
          <a href="#">About</a>
        </li>
        <li className={styles.li}>
          <a href="#">Settings</a>
        </li>
      </ul>
    </header>
  );
}

export default Header