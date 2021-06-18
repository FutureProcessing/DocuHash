import config from "config";
import { createContext, useEffect, useState } from "react";
import Web3 from "web3";

export const Web3Context = createContext<Web3 | undefined>(undefined);

interface Props {
    children: JSX.Element;
}

const Web3Provider = ({ children }: Props) => {
    const [web3, setWeb3] = useState<Web3>();

    useEffect(() => {
        setWeb3(new Web3(new Web3.providers.HttpProvider(config.ethUrl)));
    }, []);

    return <Web3Context.Provider value={web3}>{children}</Web3Context.Provider>;
};

export default Web3Provider;
