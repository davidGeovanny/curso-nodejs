import { Router, Request, Response } from 'express';
import MySQL from '../mysql/mysql';

const router = Router();

router.get( '/heroes', ( req: Request, res: Response ) => {
    const query = `
        select * 
        from heroes 
    `;

    MySQL.ejecutarQuery( query, ( err: any, data: Object[] ) => {
        if( err ) {
            res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                heroes: data
            });
        }
    });
});

router.get( '/heroes/:id', ( req: Request, res: Response ) => {
    const { id } = req.params;
    const escapeId = MySQL.instance.connection.escape( id );
    
    const query = `
        select * 
        from heroes 
        where id = ${ escapeId }
    `;

    MySQL.ejecutarQuery( query, ( err: any, data: Object[] ) => {
        if( err ) {
            res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                heroe: data[0]
            });
        }
    });
});

export default router;