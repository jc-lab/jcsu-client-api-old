import express from 'express'

import { RdbService } from 'js-express-server'

export default async function handler(req: express.Request, res: express.Response) {
    const responseList = [] as any[];

    await RdbService.getConnectionSafe(async (connection) => {
        const listResult = await connection.query(
            "SELECT `a`.*, `b`.`name` FROM `ot_pver` `a` " +
            "INNER JOIN `ot_proj` `b` ON `b`.`proj_id`=`a`.`proj_id` " +
            "ORDER BY `seq` DESC LIMIT 100"
        );
        for(let o of listResult.results) {
            responseList.push({
                seq: o.seq,
                pverId: o.pver_id,
                projId: o.proj_id,
                projName: o.name,
                status: o.status,
                uploadTime: o.created_at,
                uploadIp: o.upload_ip,
                structData: o.struct_data.toString(),
            });
        }
    });

    res.status(200).send({
        list: responseList
    });
}
