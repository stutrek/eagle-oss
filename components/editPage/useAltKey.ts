import { useEffect, useState } from 'react';

export const useAltKey = () => {
    const [isAltDown, setIsAltDown] = useState(false);

    useEffect(() => {
        const setToTrue = (event: KeyboardEvent) => {
            if (event.key === 'Alt') {
                setIsAltDown(true);
            }
        };

        const setToFalse = (event: KeyboardEvent) => {
            if (event.key === 'Alt') {
                setIsAltDown(false);
            }
        };

        window.addEventListener('keydown', setToTrue);
        window.addEventListener('keyup', setToFalse);

        return () => {
            window.removeEventListener('keydown', setToTrue);
            window.removeEventListener('keyup', setToFalse);
        };
    }, []);

    return isAltDown;
};
