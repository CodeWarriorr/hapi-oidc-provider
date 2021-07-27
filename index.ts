import Hapi from '@hapi/hapi';
import oidcProvider from './src/assembly/oidcProvider';
import { api } from './src/interactions';

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

const init = async () => {
  const server = Hapi.server({
    port: 4900,
    host: 'localhost',
  });

  /**
   * Init interaction routes
   */
  api.forEach(({ method, path, handler }) => {
    server.route({
      path,
      method,
      handler,
    });
  });

  /**
   * Init oidc routes
   */
  const callback = oidcProvider.callback();
  server.route({
    path: `/{any*}`,
    method: '*',
    async handler({ raw: { req, res } }, h) {
      await new Promise(resolve => {
        res.on('finish', resolve);
        callback(req, res);
      });

      return res.writableEnded ? h.abandon : h.continue;
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};
init();
