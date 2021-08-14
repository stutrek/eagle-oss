import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

import '../styles/globals.css';
import 'semantic-ui-css/semantic.css';
import '../styles/semantic-overrides.css';

if (!process.env.NEXT_PUBLIC_IS_DEV && typeof window !== 'undefined') {
    console.log('starting logrocket');
    LogRocket.init('tzllk9/eagle', {
        serverURL: window.origin + '/i',
    });
    setupLogRocketReact(LogRocket);
}

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
