import Head from 'next/head';
import Link from 'next/link';
import { Header } from '../components/header';
import { HeaderLayout } from '../components/layout';
import { ProjectView } from '../components/project';
import { useAllProjects } from '../hooks/useAllProjects';

import styles from '../styles/Home.module.css';

export default function Home() {
    const [isLoading, library] = useAllProjects('name');

    return (
        <HeaderLayout>
            <Head>
                <title>Eagle: Library</title>
                <meta name="description" content="Eagle Stained Glass Editor" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header>
                <h1>Library</h1>
            </Header>
            <div className={styles.container}>
                <div className={styles.addItem}>
                    <a href="/add">+ Import Design</a>
                </div>{' '}
                {isLoading && (
                    <div className={styles.libraryItem}>Loading...</div>
                )}
                {!isLoading &&
                    library.map((project) => (
                        <Link href={`/edit/${project.id}`} key={project.id}>
                            <a>
                                <ProjectView
                                    project={project}
                                    interactive={false}
                                    className={styles.libraryItem}
                                />
                            </a>
                        </Link>
                    ))}
            </div>
        </HeaderLayout>
    );
}
