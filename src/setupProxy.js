const setupProxy = require('@kineticdata/react/proxyhelper');

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
