import Link from 'next/link';
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
            <Link href="/">
                <a className={styles.logoContainer}>
                    <Logo className={styles.logo} />
                </a>
            </Link>
            <div className={styles.content}>{props.children}</div>
        </div>
    );
};
