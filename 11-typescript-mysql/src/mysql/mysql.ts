import mysql = require('mysql');

export default class MySQL {
    private static _instance: MySQL;

    connection: mysql.Connection;
    connected: boolean = false;

    constructor() {
        console.log('Clase inicializada');

        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'node_db'
        });

        this._conectarDB();
    }

    private _conectarDB() {
        this.connection.connect( ( err: mysql.MysqlError ) => {
            if( err ) {
                console.log(err.message);
                return;
            }
            this.connected = true;
            console.log('Base de datos online');
        });
    }

    public static get instance() {
        return this._instance || ( this._instance = new this() );
    }

    static ejecutarQuery( query: string, callback: Function ) {
        this.instance.connection.query( query, ( err, results: Object[], fields ) => {
            if( err ) {
                console.log('Error en query');
                console.log(err);
                return callback( err );
            }

            if( results.length === 0 ) {
                callback( 'El registro solicitado no existe' );
            } else {
                callback( null, results );
            }

        });
    }
}