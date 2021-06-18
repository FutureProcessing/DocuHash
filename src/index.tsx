import App from "components/App";
import Web3Provider from "components/Web3Provider";
import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "reportWebVitals";
import "styles/styles.scss";

ReactDOM.render(
    <React.StrictMode>
        <Web3Provider>
            <App />
        </Web3Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();
