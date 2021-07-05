// const WorkerPlugin = require('worker-plugin');

module.exports = {
    webpack(config) {
        config.resolve.fallback = {
            fs: false,
            path: false,
            crypto: false,
        };
        // config.plugins.push(
        //     new WorkerPlugin({
        //         // use "self" as the global object when receiving hot updates.
        //         globalObject: 'self',
        //     })
        // );
        return config;
    },
};
