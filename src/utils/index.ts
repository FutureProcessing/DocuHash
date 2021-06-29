import config from "config";
import crypto from "crypto-js";
import { create } from "ipfs-http-client";
import { ContractError, EthDocument, HashStorageEthContract } from "types";

const fileHashesStorageKey = "fileHashes";

const ipfs = create({ url: config.ipfsApiUrl });

const extractContractErrorType = (errorMessage: string): ContractError => {
    const errorCode = new RegExp("\\[E(\\d)\\]").exec(errorMessage);

    return errorCode ? parseInt(errorCode[1]) : ContractError.Unknown;
};

export const getFileFromChainAsync = async (
    hash: string,
    contract: HashStorageEthContract
): Promise<EthDocument | undefined> => {
    try {
        const response = await contract.methods.get(hash).call();
        const entryExists = response[3];

        if (!entryExists) {
            return;
        }

        const fileHash: string = response[0];
        const ipfsHash: string = response[1];
        const fileName: string = response[2];
        const fileType: string = response[3];
        const epoch: number = parseInt(response[4]);

        const fileBlocks = ipfs.cat(ipfsHash);
        let ipfsFileExists = false;

        for await (const block of fileBlocks) {
            ipfsFileExists = !!block;
            break;
        }

        if (!ipfsFileExists) {
            alert("File exists in the blockchain, but was not found on IPFS. Please try restarting all services.");
        }

        return { uploadTime: new Date(epoch), fileHash, ipfsHash, fileName, fileType };
    } catch (error) {
        alert("An unexpected error ocurred while fetching the file. Please check the console for details.");
        console.error(error);
    }
};

export const addFileAsync = async (file: File, contract: HashStorageEthContract, accounts: string[]) => {
    const fileContentWordArray = crypto.lib.WordArray.create((await file.arrayBuffer()) as unknown as number[]);
    const fileHash = crypto.SHA256(fileContentWordArray).toString();

    try {
        const fileIPFS = await ipfs.add({ path: file.name, content: file });

        persistFileHash(fileHash);

        await contract.methods
            .add(fileIPFS.cid.toString(), fileHash, file.name, file.type, new Date().getTime())
            .send({ from: accounts[0], gas: 1000000 });

        return fileHash;
    } catch (error) {
        const errorType = extractContractErrorType(error.message);

        if (errorType === ContractError.HashAlreadyExists) {
            alert("This file is already registered on the blockchain.");
            return fileHash;
        } else {
            alert("An unexpected error ocurred while uploading the file. Please check the console for details.");
            console.error(error);
        }
    }
};

export const getPersistedFileHashes = (): string[] => {
    const existingHashes = localStorage.getItem(fileHashesStorageKey);
    return existingHashes ? JSON.parse(existingHashes) : [];
};

export const downloadIpfsFileAsync = async (ipfsHash: string, fileName: string, fileType: string) => {
    const file = await getFileFromIpfsAsync(ipfsHash, fileType);

    if (file) {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(file);
        link.download = fileName;
        link.click();
    }
};

export const getIpfsFileUrlAsync = async (ipfsHash: string, fileType: string) => {
    const file = await getFileFromIpfsAsync(ipfsHash, fileType);

    if (file) {
        return window.URL.createObjectURL(file);
    }
};

export const syncPersistedFileHashesAsync = async (contract: HashStorageEthContract) => {
    const existingFileHashes: string[] = [];

    for (const fileHash of getPersistedFileHashes()) {
        const response = await contract.methods.get(fileHash).call();
        const entryExists = response[3];

        if (entryExists) {
            existingFileHashes.push(fileHash);
        }
    }

    localStorage.setItem(fileHashesStorageKey, JSON.stringify(existingFileHashes));

    return existingFileHashes;
};

const persistFileHash = (hash: string) => {
    const fileHashes = getPersistedFileHashes();

    if (!fileHashes.includes(hash)) {
        localStorage.setItem(fileHashesStorageKey, JSON.stringify([...getPersistedFileHashes(), hash]));
    }
};

const getFileFromIpfsAsync = async (ipfsHash: string, fileType: string) => {
    try {
        const fileBlocks = ipfs.cat(ipfsHash);
        let fileContent = new Uint8Array();

        for await (const block of fileBlocks) {
            const buffer = new Uint8Array(fileContent.byteLength + block.byteLength);
            buffer.set(new Uint8Array(fileContent), 0);
            buffer.set(new Uint8Array(block), fileContent.byteLength);
            fileContent = buffer;
        }

        if (fileContent.byteLength) {
            const blob = new Blob([fileContent], { type: fileType });
            return blob;
        }

        alert("Failed to get the file from IPFS.");
    } catch (error) {
        alert("An unexpected error ocurred while fetching the file. Please check the console for details.");
        console.error(error);
    }
};
