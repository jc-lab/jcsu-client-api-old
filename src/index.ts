import * as JsExpressServer from 'js-express-server';
import express from 'express';
import routes from './routes';

const settings = JsExpressServer.defaultSettings();
settings.apiOriginPath = '/api/v1/client';
settings.port = 8080;

const server = JsExpressServer.createServer(settings);
export const handler = (event, context) => server.lambdaHandler(event, context);

server.onerror = (type, err) => {
    console.error(type, ": ", err);
};

(async () => {
    server.use(JsExpressServer.rdbService({
        host: process.env.RDB_HOST,
        port: parseInt(process.env.RDB_PORT || '3306'),
        user: process.env.RDB_USERNAME,
        password: process.env.RDB_PASSWORD,
        database: process.env.RDB_DBNAME,
        connectionLimit: parseInt(process.env.RDB_CONNLIMIT || '8'),
        waitForConnections: true
    }));
    server.use(JsExpressServer.cloudStorageService({
        provider: process.env.STORAGE_PROVIDER || 'aws',
        accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
        secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
        endpoint: process.env.STORAGE_ENDPOINT,
        s3ForcePathStyle: true
    }));
    server.use((req: express.Request, res: express.Response, next: any) => {
        res
            .header("Access-Control-Allow-Origin", req.header('origin'))
            .header("Access-Control-Request-Methods", "GET,HEAD,OPTIONS,POST,PUT")
            .header('Access-Control-Allow-Headers', '*')
            .header('Access-Control-Allow-Credentials', 'true');
        next();
    });
    server.applyRoutes(routes);

    server.use(async (req: express.Request, res: express.Response, next: any) => {
        if(req.method == 'OPTIONS') {
            res.sendStatus(200);
            return ;
        }
        next();
    });

    console.log("Server Start!");
    server.start();

    (['SIGINT', 'SIGTERM'] as NodeJS.Signals[])
        .forEach((signal: NodeJS.Signals) => process.on(signal, () => {
            server.close();
            process.exit();
        }));
})();

