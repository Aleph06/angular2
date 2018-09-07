const PROXY_CONFIG = [{
    context: [
        "/ideal-sync-api/api"
    ],
    target: "http://localhost",
    secure: false,
    logLevel: "debug",
    changeOrigin: true
}];

module.exports = PROXY_CONFIG;