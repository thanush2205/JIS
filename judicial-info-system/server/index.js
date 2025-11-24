import app, { ensureMongo } from './app.js';

console.log('[startup] Starting Judicial Info System server (local mode)...');

function listRoutes() {
  const routes = [];
  app._router.stack.forEach(mw => {
    if (mw.route) {
      const methods = Object.keys(mw.route.methods).join(',').toUpperCase();
      routes.push(`${methods} ${mw.route.path}`);
    } else if (mw.name === 'router' && mw.handle?.stack) {
      mw.handle.stack.forEach(handler => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
          routes.push(`${methods} ${handler.route.path}`);
        }
      });
    }
  });
  console.log('Registered routes:\n' + routes.map(r => ' - ' + r).join('\n'));
}

const PORT = process.env.PORT || 5000;
ensureMongo().then(() => {
  listRoutes();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Mongo connection error:', err?.message || err);
  process.exit(1);
});

