import {
    useReducer,
    useRef,
    useEffect,
    useLayoutEffect,
    MutableRefObject,
} from 'react';
import { Project } from '../../data/types';

type CanvasState =
    | {
          measured: true;
          width: number;
          height: number;
          minZoom: number;
      }
    | {
          measured: false;
      };
type Action = { width: number; height: number; minZoom: number };

const reducer = (state: CanvasState, action: Action): CanvasState => {
    return {
        measured: true,
        ...action,
    };
};

const calculateState = (el: HTMLDivElement, project: Project): Action => {
    const width = el.offsetWidth;
    const height = el.offsetHeight;

    const projectWidth = project.width / (project.ppi / 96);
    const projectHeight = project.height / (project.ppi / 96);

    const minZoom = Math.min(width / projectWidth, height / projectHeight);

    return {
        height: height + projectHeight,
        width: width + projectWidth,
        minZoom,
    };
};

const useMinZoom = (
    project: Project | undefined
): [CanvasState, MutableRefObject<HTMLDivElement | null>] => {
    const [data, dispatch] = useReducer(reducer, { measured: false });
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (project === undefined) {
            return;
        }
        const listener = () => {
            if (containerRef.current === null) {
                return;
            }
            calculateState(containerRef.current, project);
        };
        window.addEventListener('resize', listener);
        return () => {
            window.removeEventListener('resize', listener);
        };
    }, [project]);

    useLayoutEffect(() => {
        if (containerRef.current === null || project === undefined) {
            return;
        }
        dispatch(calculateState(containerRef.current, project));
        // measure
    }, [project]);

    return [data, containerRef];
};

export default useMinZoom;
