import HashListSection from "components/HashListSection";
import SearchSection from "components/SearchSection";
import UploadSection from "components/UploadSection";
import { useEthAccounts, useHashStorageContract } from "hooks";
import { useEffect, useState } from "react";
import { addFileAsync, getPersistedFileHashes, syncPersistedFileHashesAsync } from "utils";
import styles from "./styles.module.scss";

interface Props {
    isLoading: boolean;
    setLoading: (isLoading: boolean) => void;
}

const Main = ({ isLoading, setLoading }: Props) => {
    const hashStorageContract = useHashStorageContract();
    const accounts = useEthAccounts();

    const [isSyncInProgress, setSyncInProgress] = useState(true);
    const [uploadedFileHashes, setUploadedFileHashes] = useState<string[]>(getPersistedFileHashes());

    const onUpload = async (file: File) => {
        if (hashStorageContract && accounts && !isLoading) {
            setLoading(true);
            const fileHash = await addFileAsync(file, hashStorageContract!, accounts!);
            setLoading(false);

            if (fileHash) {
                setUploadedFileHashes(getPersistedFileHashes());
            }
        }
    };

    useEffect(() => {
        if (hashStorageContract) {
            syncPersistedFileHashesAsync(hashStorageContract).then((hashes) => setUploadedFileHashes(hashes));
            setSyncInProgress(false);
        }
    }, [hashStorageContract]);

    return (
        <main className={styles["main"]}>
            <h1 className={styles["main__header"]}>DocuHash</h1>
            <UploadSection onUpload={onUpload} />
            <HashListSection isSyncInProgress={isSyncInProgress} uploadedFileHashes={uploadedFileHashes} />
            <SearchSection isLoading={isLoading} setLoading={setLoading} />
        </main>
    );
};

export default Main;
