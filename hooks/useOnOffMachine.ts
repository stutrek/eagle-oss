import { useMemo, useState } from 'react';

type OnOffState = 'on' | 'off';

export const useOnOffMachine = (initialState: OnOffState = 'off') => {
    const [state, setState] = useState<OnOffState>(initialState);

    const [onState, offState] = useMemo(() => {
        return [
            {
                val: 'on' as OnOffState,
                isOn: true,
                turnOff: () => setState('off'),
                toggle: () => setState('off'),
            },
            {
                val: 'off' as OnOffState,
                isOn: false,
                turnOn: () => setState('on'),
                toggle: () => setState('on'),
            },
        ];
    }, []);

    return state === 'on' ? onState : offState;
};
