import classNames from "classnames";
import styles from "./styles.module.scss";

interface Props {
    className?: string;
    title: string;
    children: JSX.Element;
}

const Container = ({ className, title, children }: Props) => (
    <div className={classNames(styles["container"], className)}>
        <h1 className={styles["container__title"]}>{title}</h1>
        {children}
    </div>
);

export default Container;
