import classNames from "classnames";
import Container from "components/Container";
import { useEthAccounts, useHashStorageContract } from "hooks";
import { useState } from "react";
import { EthDocument } from "types";
import { downloadIpfsFileAsync, getFileFromChainAsync, getIpfsFileUrlAsync } from "utils";
import styles from "./styles.module.scss";

interface Props {
    isLoading: boolean;
    setLoading: (isLoading: boolean) => void;
}

const SearchSection = ({ isLoading, setLoading }: Props) => {
    const accounts = useEthAccounts();
    const hashStorageContract = useHashStorageContract();

    const [searchFileHash, setSearchFileHash] = useState<string>();
    const [searchedFileDetails, setSearchedFileDetails] = useState<EthDocument>();
    const [isFileSearchError, setFileSearchError] = useState<boolean>(false);

    const onSearch = async () => {
        if (hashStorageContract && accounts && searchFileHash) {
            setLoading(true);
            const file = await getFileFromChainAsync(searchFileHash, hashStorageContract);
            setLoading(false);

            setSearchedFileDetails(file);
            setFileSearchError(!file);
        }
    };

    return (
        <Container title="Search by hash">
            <>
                <div className={styles["search-section__search-container"]}>
                    <input
                        className={styles["search-section__input"]}
                        onChange={(event) => setSearchFileHash(event.target.value)}
                    />
                    <button
                        className={classNames(styles["search-section__search-button"], {
                            [styles["search-section__search-button--disabled"]]: isLoading,
                        })}
                        disabled={isLoading || searchFileHash === searchedFileDetails?.fileHash}
                        onClick={onSearch}>
                        Search
                    </button>
                </div>
                {searchedFileDetails && (
                    <div className={styles["search-section__file-details"]}>
                        <h2 className={styles["search-section__subtitle"]}>File info read form the blockchain:</h2>
                        <label className={styles["search-section__label"]}>File hash</label>
                        <div>{searchedFileDetails.fileHash}</div>
                        <label className={styles["search-section__label"]}>IPFS hash (CID)</label>
                        <div>{searchedFileDetails.ipfsHash}</div>
                        <label className={styles["search-section__label"]}>File name</label>
                        <div>{searchedFileDetails.fileName}</div>
                        <label className={styles["search-section__label"]}>File type</label>
                        <div>{searchedFileDetails.fileType}</div>
                        <label className={styles["search-section__label"]}>Upload time</label>
                        <div>{searchedFileDetails.uploadTime.toString()}</div>
                        <div className={styles["search-section__buttons"]}>
                            <button
                                onClick={async () =>
                                    window.open(
                                        await getIpfsFileUrlAsync(
                                            searchedFileDetails.ipfsHash,
                                            searchedFileDetails.fileType
                                        ),
                                        "_blank"
                                    )
                                }>
                                Browse the file
                            </button>
                            <button
                                onClick={async () =>
                                    await downloadIpfsFileAsync(
                                        searchedFileDetails.ipfsHash,
                                        searchedFileDetails.fileName,
                                        searchedFileDetails.fileType
                                    )
                                }>
                                Download the file
                            </button>
                        </div>
                    </div>
                )}
                {isFileSearchError && (
                    <div className={styles["search-section__error"]}>Failed to find the file. Please try again.</div>
                )}
            </>
        </Container>
    );
};

export default SearchSection;
