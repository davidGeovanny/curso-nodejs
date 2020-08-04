"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mysql_1 = __importDefault(require("../mysql/mysql"));
const router = express_1.Router();
router.get('/heroes', (req, res) => {
    const query = `
        select * 
        from heroes 
    `;
    mysql_1.default.ejecutarQuery(query, (err, data) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        else {
            res.json({
                ok: true,
                heroes: data
            });
        }
    });
});
router.get('/heroes/:id', (req, res) => {
    const { id } = req.params;
    const escapeId = mysql_1.default.instance.connection.escape(id);
    const query = `
        select * 
        from heroes 
        where id = ${escapeId}
    `;
    mysql_1.default.ejecutarQuery(query, (err, data) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        else {
            res.json({
                ok: true,
                heroe: data[0]
            });
        }
    });
});
exports.default = router;
