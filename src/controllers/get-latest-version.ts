import express from 'express';
import {RdbService} from 'js-express-server';

export default async function handler(req: express.Request, res: express.Response) {
  const dgrpId: string = req.params.dgrpId;
  let responseCode = 500;
  const responseBody = {};

  await RdbService.getConnectionSafe(async (connection) => {
    const dgrpResult = await connection.query(
      'SELECT `seq`,`version_number`, `version_display` FROM `ot_dply` WHERE `dgrp_id`=? ORDER BY `seq` DESC',
      [dgrpId]);

    if (dgrpResult.results.length <= 0) {
      responseCode = 204;
      return ;
    }

    const item = dgrpResult.results[0];
    responseCode = 200;
    responseBody['vid'] = item.seq;
    responseBody['version_number'] = item.version_number;
    responseBody['version_display'] = item.version_display;
  });

  res
    .status(responseCode)
    .send(responseBody);
}

