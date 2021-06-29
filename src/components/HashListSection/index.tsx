import classNames from "classnames";
import Container from "components/Container";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

interface Props {
    isSyncInProgress: boolean;
    uploadedFileHashes: string[];
}

const HashListSection = ({ isSyncInProgress, uploadedFileHashes }: Props) => {
    const [lastElementHighlighted, setLastElementHighlighted] = useState(false);
    const [prevUploadedFileHashesLength, setPrevUploadedFileHashesLength] = useState(uploadedFileHashes.length);

    useEffect(() => {
        if (uploadedFileHashes.length === prevUploadedFileHashesLength + 1) {
            setTimeout(() => setLastElementHighlighted(true));
            setTimeout(() => setLastElementHighlighted(false), 1000);
        }

        setPrevUploadedFileHashesLength(uploadedFileHashes.length);
    }, [prevUploadedFileHashesLength, uploadedFileHashes.length]);

    return (
        <Container title="Your stored file hashes">
            <>
                {isSyncInProgress ? (
                    <div className={styles["hash-list-section__row"]}>Syncing files, please wait...</div>
                ) : (
                    <>
                        {uploadedFileHashes.length === 0 && (
                            <div className={styles["hash-list-section__row"]}>No files have been uploaded yet.</div>
                        )}
                        {uploadedFileHashes.map((hash, index) => (
                            <div
                                className={classNames(styles["hash-list-section__row"], {
                                    [styles["hash-list-section__row--highlighted"]]:
                                        index === uploadedFileHashes.length - 1 && lastElementHighlighted,
                                })}
                                key={hash}>
                                <span className={styles["hash-list-section__hash-index"]}>{index + 1}</span>
                                <span className={styles["hash-list-section__hash"]}>{hash}</span>
                            </div>
                        ))}
                    </>
                )}
            </>
        </Container>
    );
};

export default HashListSection;
