import express from 'express';
import { RdbService, CloudStorageService } from 'js-express-server';

import * as url from 'url';

import * as AppEnv from '../app-env';

function decodeBase64url(str) {
  str = (str + '===').slice(0, str.length + (str.length % 4));
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
}

export default async function handler(req: express.Request, res: express.Response) {
  const dgrpId: string = req.params.dgrpId;
  const vid = req.params.vid;
  let responseCode = 500;
  const responseBody = {};

  await RdbService.getConnectionSafe(async (connection) => {
    const dgrpResult = await connection.query(
      'SELECT `a`.`seq`,`a`.`version_number`, `a`.`version_display`,`a`.`signed_metadata`,`b`.`proj_id` FROM `ot_dply` `a` ' +
            'INNER JOIN `ot_dgrp` `b` ON `b`.`dgrp_id`=`a`.`dgrp_id`' +
            'WHERE `a`.`dgrp_id`=? AND `a`.`seq`=?',
      [dgrpId, vid]);

    if (dgrpResult.results.length <= 0) {
      responseCode = 404;
      return ;
    }

    const deployItem = dgrpResult.results[0];
    const metadata = JSON.parse(decodeBase64url(deployItem.signed_metadata.split('.')[1]));
    let fileList: any[];

    if (AppEnv.APP_USE_PROXYED_DOWNLOAD) {
      fileList = (metadata.distribute_files as any[])
        .reduce((results, item) => {
          const downloadUrl = new url.URL(`p/${deployItem.proj_id}/file/${item.file_hash_md5}`, AppEnv.APP_PROXYED_URL);
          results.push({
            file_hash_md5: item.file_hash_md5,
            url: downloadUrl
          });
          return results;
        }, []);
    } else {
      fileList = [];
      await (metadata.distribute_files as any[])
        .reduce((prev, item) => {
          return prev
            .then(() => CloudStorageService.getSignedUrl('getObject', {
              bucketName: AppEnv.STORAGE_BUCKET_NAME,
              key: deployItem.proj_id + '/file/' + item.file_hash_md5
            }))
            .then((signedUrl) => {
              fileList.push({
                file_hash_md5: item.file_hash_md5,
                url: signedUrl
              });
            });
        }, Promise.resolve());
    }
    responseCode = 200;
    responseBody['vid'] = deployItem.seq;
    responseBody['version_number'] = deployItem.version_number;
    responseBody['version_display'] = deployItem.version_display;
    responseBody['signed_metadata'] = deployItem.signed_metadata;
    responseBody['file_list'] = fileList;
  });

  res
    .status(responseCode)
    .send(responseBody);
}
