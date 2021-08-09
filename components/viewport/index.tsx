import React, { useCallback, useEffect, useState } from 'react';

const initialOuterStyles = {
    position: 'absolute',
    overflow: 'auto',
    visibility: 'hidden',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
} as const;

const initialInnerStyles = {
    margin: 'auto',
    display: 'inline-block',
} as const;

function calculateCenterRatio(
    viewportEl: HTMLDivElement,
    contentWidth: number,
    contentHeight: number,
    currentZoom: number
) {
    const viewportWidth = viewportEl.offsetWidth;
    const viewportHeight = viewportEl.offsetHeight;

    const scaledContentWidth = contentWidth * currentZoom;
    const scaledContentHeight = contentHeight * currentZoom;

    let contentCenterLeft;
    let contentCenterTop;
    if (viewportWidth > scaledContentWidth) {
        contentCenterLeft = scaledContentWidth / 2;
    } else {
        const viewportCenterLeft = viewportWidth / 2;
        contentCenterLeft = viewportEl.scrollLeft + viewportCenterLeft;
    }

    if (viewportHeight > scaledContentHeight) {
        contentCenterTop = scaledContentHeight / 2;
    } else {
        const viewportCenterTop = viewportHeight / 2;
        contentCenterTop = viewportEl.scrollTop + viewportCenterTop;
    }

    const centerLeftRatio = contentCenterLeft / scaledContentWidth;
    const centerTopRatio = contentCenterTop / scaledContentHeight;

    return [centerLeftRatio, centerTopRatio];
}

export const useViewport = (allowScroll = true) => {
    const [zoom, innerSetZoom] = useState(1);
    const [minZoom, setMinZoom] = useState(1);
    const [originalHeight, setOriginalHeight] = useState(0);
    const [originalWidth, setOriginalWidth] = useState(0);

    const [outerEl, setOuterEl] = useState<HTMLDivElement>();
    const [innerEl, setInnerEl] = useState<HTMLDivElement>();

    const outerRef = useCallback((el: HTMLDivElement | null) => {
        setOuterEl(el || undefined);
    }, []);
    const innerRef = useCallback((el: HTMLDivElement | null) => {
        setInnerEl(el || undefined);
    }, []);

    const [outerStyles, setOuterStyles] =
        useState<React.CSSProperties>(initialOuterStyles);

    const [innerStyles, setInnerStyles] =
        useState<React.CSSProperties>(initialInnerStyles);

    const setZoom = useCallback(
        (newZoom: number, forceCenter = false) => {
            if (!innerEl || !outerEl) {
                return;
            }
            const [centerLeftRatio, centerTopRatio] = forceCenter
                ? [0.5, 0.5]
                : calculateCenterRatio(
                      outerEl,
                      originalWidth,
                      originalHeight,
                      zoom
                  );

            const viewportWidth = outerEl.offsetWidth;
            const viewportHeight = outerEl.offsetHeight;

            const scaledWidth = originalWidth * newZoom;
            const scaledHeight = originalHeight * newZoom;

            let scrollTop = 0;
            let scrollLeft = 0;
            let marginTop = 0;
            let marginLeft = 0;

            if (scaledWidth > viewportWidth) {
                const minCenterRatio = viewportWidth / 2 / scaledWidth;
                const maxCenterRatio = 1 - minCenterRatio;

                if (centerLeftRatio > maxCenterRatio) {
                    scrollLeft = scaledWidth - viewportWidth;
                } else if (centerLeftRatio < minCenterRatio) {
                    scrollLeft = 0;
                } else {
                    scrollLeft =
                        (scaledWidth - viewportWidth) * centerLeftRatio;
                }
            }
            if (scaledWidth < viewportWidth) {
                marginLeft = (viewportWidth - scaledWidth) * centerLeftRatio;
            }

            if (scaledHeight > viewportHeight) {
                scrollTop = (scaledHeight - viewportHeight) * centerTopRatio;
            }
            if (scaledHeight < viewportHeight) {
                marginTop = (viewportHeight - scaledHeight) * centerTopRatio;
            }

            setInnerStyles({
                ...innerStyles,
                transform: `scale(${newZoom})`,
                transformOrigin: '0 0',
                // height: scaledHeight,
                // width: scaledWidth,
            });

            setOuterStyles({
                ...outerStyles,
                overflow: allowScroll ? 'auto' : 'hidden',
                visibility: 'visible',
                padding: `${marginTop}px 0 0 ${marginLeft}px`,
            });

            requestAnimationFrame(() => {
                outerEl.scrollTo(scrollLeft, scrollTop);
            });

            innerSetZoom(newZoom);
        },
        [innerEl, outerEl, originalWidth, originalHeight, zoom]
    );

    useEffect(() => {
        if (!outerEl || !innerEl) {
            return;
        }

        const contentWidth = innerEl.firstElementChild?.clientWidth || 0;
        const contentHeight = innerEl.firstElementChild?.clientHeight || 0;

        setOriginalHeight(contentHeight);
        setOriginalWidth(contentWidth);
    }, [outerEl, innerEl]);

    useEffect(() => {
        if (!outerEl) {
            return;
        }
        const viewportWidth = outerEl.offsetWidth;
        const viewportHeight = outerEl.offsetHeight;

        const widthRatio = viewportWidth / originalWidth;
        const heightRatio = viewportHeight / originalHeight;
        const calculatedZoom = Math.min(widthRatio, heightRatio);
        setMinZoom(calculatedZoom);

        setZoom(calculatedZoom, true);
    }, [originalWidth, originalHeight]);

    return {
        outerProps: { ref: outerRef, style: outerStyles },
        innerProps: { ref: innerRef, style: innerStyles },
        zoom,
        minZoom,
        setZoom,
    };
};

export type Viewport = ReturnType<typeof useViewport>;
