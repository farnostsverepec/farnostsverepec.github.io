const path = require('path');

module.exports = function override(config, env) {
    config.resolve.alias = {
            ...config.resolve.alias,
            '@components': path.resolve(__dirname, 'src/components/'),
            '@pages': path.resolve(__dirname, 'src/pages/'),
            '@functions': path.resolve(__dirname, 'src/functions/'),
            '@img': path.resolve(__dirname, 'src/images/')
    };
    return config;
};
