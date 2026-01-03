module.exports = {
    apps: [
        {
            name: 'ebay-api-monitor',
            script: 'dist/src/main.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 4044,
            },
        },
    ],
};
