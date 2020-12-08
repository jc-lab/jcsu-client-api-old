import express from 'express';
import { CloudStorageService } from 'js-express-server';
import { S3 } from 'aws-sdk';

import * as AppEnv from '../app-env';

export default async function handler(req: express.Request, res: express.Response) {
  const projId: string = req.params.projId;
  const file: string = req.params.file;
  const s3: S3 = CloudStorageService.getNative();
  s3.getObject({
    Bucket: AppEnv.STORAGE_BUCKET_NAME,
    Key: projId + '/file/' + file
  })
    .createReadStream()
    .pipe(res);
}
