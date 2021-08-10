// const WorkerPlugin = require('worker-plugin');

module.exports = {
    webpack(config) {
        config.resolve.fallback = {
            fs: false,
            path: false,
            crypto: false,
        };
        return config;
    },
    async rewrites() {
        return [
            {
                source: '/i/:path*',
                destination: 'https://r.lr-in.com/i/:path*',
            },
        ];
    },
};
