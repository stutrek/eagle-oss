import Head from 'next/head';
import Link from 'next/link';
import { Button, Icon } from 'semantic-ui-react';
import { Header } from '../components/header';
import { HeaderLayout } from '../components/layout';
import { ProjectView } from '../components/project';
import { ProjectImg } from '../components/project/img';
import { renderProject } from '../data/projectString';
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
                <h1>Pattern Library</h1>
                <hr />
                <div>
                    <Link href="/add">
                        <Button basic>
                            <Icon name="plus circle" />
                            Import Design
                        </Button>
                    </Link>
                </div>
                <div data-flex />
            </Header>
            <div className={styles.container}>
                {isLoading && (
                    <div className={styles.libraryItem}>Loading...</div>
                )}
                {!isLoading &&
                    library.map((project) => (
                        <Link href={`/edit/${project.id}`} key={project.id}>
                            <a className={styles.libraryItem}>
                                <span className={styles.imageContainer}>
                                    <ProjectImg
                                        project={project}
                                        color="color"
                                        showLabels={false}
                                    />
                                </span>
                                <span className={styles.label}>
                                    {project.name}
                                </span>
                            </a>
                        </Link>
                    ))}
            </div>
        </HeaderLayout>
    );
}
