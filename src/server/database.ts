import * as mysql from 'mysql2'
import * as mysqlPromise from 'mysql2/promise'

export class Database {
    sync: mysql.Pool
    async: mysqlPromise.Pool

    constructor() {
        this.sync = mysql.createPool({
            host: 'localhost',
            user: 'gtaplus',
            database: 'gtaplus',
            password: 'gtaplus'
        })

        this.async = this.sync.promise()
    }
}