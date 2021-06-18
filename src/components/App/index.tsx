import Footer from "components/Footer";
import Header from "components/Header";
import Loader from "components/Loader";
import Main from "components/Main";
import Particles from "components/Particles";
import { useState } from "react";
import styles from "./styles.module.scss";

const App = () => {
    const [isLoading, setLoading] = useState(false);

    return (
        <div className={styles["app"]}>
            <Loader isLoading={isLoading} />
            <Header />
            <Main isLoading={isLoading} setLoading={setLoading} />
            <Footer />
            <Particles />
        </div>
    );
};

export default App;
