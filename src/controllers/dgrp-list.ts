import express from 'express'

import { RdbService } from 'js-express-server'

export default async function handler(req: express.Request, res: express.Response) {
    const projectId = req.params.projectId;
    const responseList = [] as any[];

    await RdbService.getConnectionSafe(async (connection) => {
        const listResult = await connection.query(
            "SELECT * FROM `ot_dgrp` WHERE `proj_id`=?", [projectId]
        );
        for(let o of listResult.results) {
            responseList.push({
                id: o.dgrp_id,
                name: o.name
            });
        }
    });

    res.status(200).send({
        list: responseList
    });
}
