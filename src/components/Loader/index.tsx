import classNames from "classnames";
import styles from "./styles.module.scss";

interface Props {
    isLoading: boolean;
}

const Loader = ({ isLoading }: Props) => (
    <div className={classNames(styles["loader"], { [styles["loader--visible"]]: isLoading })}>
        {new Array(12).fill(undefined).map((_, index) => (
            <div key={index} />
        ))}
    </div>
);

export default Loader;
