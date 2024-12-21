// filepath: /c:/backend-skin-cancerr/src/routes/routes.js
import { predictHandler, notFoundHandler } from '../server/handler.js';

const routes = [
  {
    method: 'POST',
    path: '/predict',
    handler: predictHandler,
  },
  {
    method: '*',
    path: '/{any*}',
    handler: notFoundHandler,
  },
];

export default routes;