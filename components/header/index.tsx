import Link from 'next/link';
import { signIn, useSession } from 'next-auth/client';
import React from 'react';
import { Button, Loader } from 'semantic-ui-react';
import Logo from '../logos/logo small text.svg';

import styles from './header.module.css';

interface HeaderProps {
    className?: string;
    children: React.ReactNode;
}

const AccountLabel = () => {
    const [session, loading] = useSession();
    if (loading) {
        return <Loader active />;
    }
    if (session === null || session.user === undefined) {
        return <Button onClick={() => signIn()}>Sign In</Button>;
    }
    if (session.user.image) {
        return <img src={session.user.image} />;
    }

    if (session.user.name) {
        const initials = session.user.name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase();
        return <div className={styles.initials}>{initials}</div>;
    }

    return <div>Who?</div>;
};

export const Header = (props: HeaderProps) => {
    return (
        <div className={styles.container + ' ' + (props.className ?? '')}>
            <Link href="/">
                <a className={styles.logoContainer}>
                    <Logo className={styles.logo} />
                </a>
            </Link>
            <div className={styles.content}>{props.children}</div>
            <div className={styles.account}>
                <AccountLabel />
            </div>
        </div>
    );
};
