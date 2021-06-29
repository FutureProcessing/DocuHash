import { Web3Context } from "components/Web3Provider";
import HashStorageContract from "contracts/HashStorage.json";
import { useContext, useEffect, useState } from "react";
import { EthContract, HashStorageEthContract, RawEthContract } from "types";

export const useEthAccounts = () => {
    const web3 = useContext(Web3Context);
    const [accounts, setAccounts] = useState<string[]>();

    useEffect(() => {
        const execute = async () => {
            if (web3) {
                setAccounts(await web3.eth.getAccounts());
            }
        };

        execute();
    }, [web3]);

    return accounts;
};

const useEthContract = <T extends EthContract>(rawContract: RawEthContract) => {
    const web3 = useContext(Web3Context);
    const [contract, setContract] = useState<T>();

    useEffect(() => {
        const execute = async () => {
            if (web3) {
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = rawContract.networks[networkId];
                const instance = new web3.eth.Contract(
                    rawContract.abi,
                    deployedNetwork && deployedNetwork.address
                ) as unknown as T;

                setContract(instance);
            }
        };

        execute();
    }, [rawContract, web3]);

    return contract;
};

export const useHashStorageContract = () =>
    useEthContract<HashStorageEthContract>(HashStorageContract as RawEthContract);
