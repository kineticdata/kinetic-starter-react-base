const removeSecure = cookie => cookie.replace(/;\s*Secure/i, '');
const removeSameSiteNone = cookie => cookie.replace(/;\s*SameSite=None/i, '');

const setupProxy = (target = process.env.REACT_APP_PROXY_HOST) => ({
  target,
  secure: true,
  changeOrigin: true,
  ws: true,
  xfwd: true,
  onProxyReq: proxyReq => {
    // Browsers may send Origin headers even with same-origin
    // requests. To prevent CORS issues, we have to change
    // the Origin to match the target URL.
    if (proxyReq.getHeader('origin')) {
      proxyReq.setHeader('origin', target);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    const setCookie = proxyRes.headers['set-cookie'];
    if (setCookie && req.protocol === 'http') {
      proxyRes.headers['set-cookie'] = Array.isArray(setCookie)
        ? setCookie.map(removeSecure).map(removeSameSiteNone)
        : removeSameSiteNone(removeSecure(setCookie));
    }
  },
});

// Not currently exported from @kineticdata/react, so the content of
// proxyhelper is defined above instead.
// TODO Uncomment and remove above code once proxyhelper can be imported.
// const setupProxy = require('@kineticdata/react/proxyhelper');

const options = {
  ...setupProxy(),
  secure: false,
};

const proxy = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    proxy(
      ['**', '!/', '!/index.html', '!/static/**', '!/sockjs-node'],
      options,
    ),
  );
};
