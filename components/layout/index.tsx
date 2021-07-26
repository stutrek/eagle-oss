import React from 'react';

import styles from './layout.module.css';

type Props = {
    children: React.ReactNode;
};

type SidebarProps = Props & {
    padding?: boolean;
};

export const HeaderLayout = (props: Props) => {
    return <div className={styles.headerLayoutContainer}>{props.children}</div>;
};

export const ContentWithSidebar = (props: Props) => {
    return <div className={styles.layoutWithSidebar}>{props.children}</div>;
};

export const Sidebar = (props: SidebarProps) => {
    return (
        <div
            className={
                props.padding ? styles.sidebarWithPadding : styles.sidebar
            }
        >
            {props.children}
        </div>
    );
};
