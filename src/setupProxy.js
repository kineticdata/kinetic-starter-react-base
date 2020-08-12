const setupProxy = require('@kineticdata/react/proxyhelper');

const options = {
  ...setupProxy(),
  secure: false,
};

const proxy = require("http-proxy-middleware");
module.exports = function(app) {
  app.use(proxy('/app', options));
  app.use(proxy('/core*.pack', options));
  app.use(proxy('/favicon.ico', options));
}
