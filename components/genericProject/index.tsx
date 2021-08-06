import SimpleTulip from './simple tulip.svg';

import styles from './genericProject.module.css';

export const Color = () => (
    <div className={styles.container}>
        <SimpleTulip className="asdf" />
    </div>
);

export const Grayscale = () => (
    <div className={styles.grayscale}>
        <SimpleTulip className="asdf" />
    </div>
);

export const Outlines = () => (
    <div className={styles.outlines}>
        <SimpleTulip className="asdf" />
    </div>
);
