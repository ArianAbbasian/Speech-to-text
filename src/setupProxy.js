// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://your-api-endpoint.com',
      changeOrigin: true,
      secure: false, // Add this for HTTPS issues
      logLevel: 'debug', // This will show proxy logs
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request:', req.path);
      },
    })
  );
};