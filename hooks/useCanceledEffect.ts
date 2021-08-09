import { DependencyList, useEffect } from 'react';

export function useCanceledEffect<T>(
    promiseFn: () => Promise<T> | T,
    resultFn: (result: T) => unknown,
    dependencies: DependencyList
) {
    useEffect(() => {
        let canceled = false;
        const result = promiseFn();
        if (result instanceof Promise) {
            result.then((result) => {
                if (canceled === false) {
                    resultFn(result);
                }
            });
        } else {
            resultFn(result);
        }

        return () => {
            canceled = true;
        };
    }, dependencies);
}
