import React from 'react';

import styles from './layout.module.css';

interface Props {
    children: React.ReactNode;
}

export const HeaderLayout = (props: Props) => {
    return <div className={styles.headerLayoutContainer}>{props.children}</div>;
};
