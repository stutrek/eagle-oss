//@flow
import React, { Fragment } from 'react';
import { Dropdown, Menu, Icon } from 'semantic-ui-react';

import type { Project } from 'src/Models';

import styles from './toolbar.module.css';

type Props = {
    project: Project,
    getDownloadHref: Function,
    setZoom: Function,
    currentZoom: number,
    minZoom: number,
    maxZoom: number,
    setNightMode: Function,
    setLabelsShowing: Function,
    openInNewWindow: Function,
    labelsShowing: boolean,
    nightMode: boolean,
};

export default class Toolbar extends React.Component<Props> {
    downloadOptions = [
        {
            key: 'color',
            text: 'Full Color',
            as: 'a',
            onClick: (event: SyntheticEvent<HTMLAnchorElement>) => {
                event.currentTarget.setAttribute('download', this.props.project.name + '.svg');
                this.setDownloadHref(event);
            },
        },
        {
            key: 'gray',
            text: 'Grayscale',
            as: 'a',
            onClick: (event: SyntheticEvent<HTMLAnchorElement>) => {
                event.currentTarget.setAttribute('download', this.props.project.name + '.svg');
                this.setDownloadHref(event, 'grayscale');
            },
        },
        {
            key: 'white',
            text: 'White',
            as: 'a',
            onClick: (event: SyntheticEvent<HTMLAnchorElement>) => {
                event.currentTarget.setAttribute('download', this.props.project.name + '.svg');
                this.setDownloadHref(event, 'white');
            },
        },
    ];

    setDownloadHref = (event: SyntheticEvent<HTMLAnchorElement>, colorOverride: ?string) => {
        event.currentTarget.href = this.props.getDownloadHref(colorOverride);
    };

    zoomIn = () => {
        let nextLevel = Math.floor(this.props.currentZoom * 10 + 1) / 10;
        this.props.setZoom(nextLevel);
    };

    zoomOut = () => {
        let nextLevel = Math.floor(this.props.currentZoom * 10 - 1) / 10;
        this.props.setZoom(nextLevel);
    };

    setNightMode = (event: SyntheticEvent<HTMLInputElement>) => {
        this.props.setNightMode(event.currentTarget.checked);
    };

    setLabelsShowing = (event: SyntheticEvent<HTMLInputElement>) => {
        this.props.setLabelsShowing(event.currentTarget.checked);
    };

    render() {
        const { project } = this.props;
        const width = project.width / project.ppi;
        const height = project.height / project.ppi;
        const filledInCount = project.pieces.filter(p => p.glass).length;
        const emptySpaceCount = project.pieces.length - filledInCount;
        const spacesPlural = emptySpaceCount === 1 ? 'space' : 'spaces';
        return (
            <Fragment>
                <h1>{project.name}</h1>
                <hr />
                <div className={styles.pieceCount}>
                    {filledInCount} pieces
                    <br />
                    {emptySpaceCount || 'no'} empty {spacesPlural}
                </div>
                <hr />
                <Dropdown
                    trigger={<Icon name="download" size="large" />}
                    icon={null}
                    options={this.downloadOptions}
                    pointing="top left"
                />{' '}
                <a
                    onMouseDown={this.props.openInNewWindow}
                    href=""
                    className={styles.icon}
                    title="Open in new window"
                >
                    <Icon name="external alternate" size="large" />
                </a>
                <a
                    href={`/glass-list/${project.id}`}
                    target="_blank"
                    className={styles.icon}
                    title="View glass list"
                >
                    <Icon name="list alternate outline" size="large" />
                </a>
                <div data-flex />
                <div className={styles.checkboxOption}>
                    <label>
                        <input
                            type="checkbox"
                            onChange={this.setLabelsShowing}
                            checked={this.props.labelsShowing}
                        />{' '}
                        Labels
                    </label>
                </div>
                <div className={styles.checkboxOption}>
                    <label>
                        <input
                            type="checkbox"
                            onChange={this.setNightMode}
                            checked={this.props.nightMode}
                        />{' '}
                        Night Mode
                    </label>
                </div>
                <hr />
                <div className={styles.zoom}>
                    <button
                        onClick={this.zoomOut}
                        disabled={this.props.currentZoom === this.props.minZoom}
                    >
                        <Icon name="minus" />
                    </button>{' '}
                    {Math.round(this.props.currentZoom * 100)}%{' '}
                    <button
                        onClick={this.zoomIn}
                        disabled={this.props.currentZoom === this.props.maxZoom}
                    >
                        <Icon name="plus" />
                    </button>
                </div>
                <div>
                    <input type="text" value={width} readOnly size="4" /> x
                    <input type="text" value={height} readOnly size="4" />
                </div>
            </Fragment>
        );
    }
}
