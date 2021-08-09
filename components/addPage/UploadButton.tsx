import { ImageProcessorReturn } from '../../data/imageProcessor/useImageProcessor';
import styles from './uploadButton.module.css';

type Props = {
    listeners: ImageProcessorReturn['listeners'];
    errorMessage: string | undefined;
};

export const UploadButton = ({ listeners, errorMessage }: Props) => {
    return (
        <label className={styles.upload}>
            {errorMessage && (
                <div className={styles.errorMessage}>{errorMessage}</div>
            )}
            <input type="file" {...listeners} />
            <div className={styles.text}>
                Click to select an image
                <br />
                or drag a file here.
            </div>
        </label>
    );
};
