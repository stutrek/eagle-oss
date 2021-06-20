import React from 'react';
import Logo from '../logos/logo small text.svg';

import styles from './header.module.css';

interface HeaderProps {
    className?: string;
    children: React.ReactNode;
}

export const Header = (props: HeaderProps) => {
    return (
        <div className={styles.container + ' ' + (props.className ?? '')}>
            <a className={styles.logoContainer} href="/">
                <Logo className={styles.logo} />
            </a>
            <div className={styles.content}>{props.children}</div>
        </div>
    );
};
