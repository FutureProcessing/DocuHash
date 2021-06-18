import Web3 from "web3";
import { AbiItem } from "web3-utils";

declare global {
    interface Window {
        ethereum: any;
        web3: Web3 | undefined;
    }
}

window.ethereum = window.ethereum || {};

type ContractGetterReturnValue<T> = { call: () => Promise<T> };

type ContractSetterReturnValue<T> = {
    send: (params: { from: string; gas?: number }) => Promise<T>;
};

interface HashStorageGetResult {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: boolean;
}

export interface RawEthContract {
    networks: { [key: string]: { address: string } };
    abi: AbiItem | AbiItem[];
}

export interface EthContract {
    methods: object;
}

export interface HashStorageEthContract extends EthContract {
    methods: {
        get: (fileHash: string) => ContractGetterReturnValue<HashStorageGetResult>;
        add: (
            ipfsHash: string,
            fileHash: string,
            fileName: string,
            fileType: string,
            dateAdded: number
        ) => ContractSetterReturnValue<void>;
    };
}

export interface IPFSFile {
    hash: string;
    time: number;
    url: string;
    exists: boolean;
}

export interface EthDocument {
    uploadTime: Date;
    fileHash: string;
    ipfsHash: string;
    fileName: string;
    fileType: string;
}

export enum ContractError {
    Unknown,
    HashAlreadyExists,
}
