import { Route } from 'js-express-server'

const routes: Route[] = [
    {
        path: '/d/:dgrpId/latest-version',
        method: 'get',
        handler: require('./controllers/get-latest-version')
    },
    {
        path: '/d/:dgrpId/file-list/:vid',
        method: 'get',
        handler: require('./controllers/get-file-list')
    }
];

export default routes;
