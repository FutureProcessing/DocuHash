import FPLogo from "images/fp-logo.png";
import styles from "./styles.module.scss";

const Footer = () => (
    <footer className={styles["footer"]}>
        <img src={FPLogo} alt="FP logo" />
        <span>Powered by Future Processing</span>
    </footer>
);

export default Footer;
