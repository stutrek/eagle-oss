import { ImageProcessorReturn } from '../../../data/imageProcessor/useImageProcessor';
import styles from './uploadButton.module.css';

type Props = {
    listeners: ImageProcessorReturn['listeners'];
};

export const UploadButton = ({ listeners }: Props) => {
    return (
        <label className={styles.upload}>
            <input type="file" {...listeners} />
            <div className={styles.text}>
                Click to select an image
                <br />
                or drag a file here.
            </div>
        </label>
    );
};
