import * as postgres from 'pg'

export class Database {
    pool: postgres.Pool

    constructor() {
        this.pool = new postgres.Pool({
            host: 'localhost',
            user: 'gtap_dev',
            password: 'gtap_dev',
            database: 'gtap_dev'
        })    
    }

    async query(sql: string, variables?: Array<any>): Promise<postgres.QueryResult> {
        return new Promise(async (resolve) => {
            this.pool.query(sql, variables)
            .then(res => resolve(res))
            .catch(e => { console.error('DB ERROR: ' + e.message); console.error(e.stack) })
        })
    }

    async getFirst(sql: string, variables?: Array<any>): Promise<postgres.QueryResultRow> {
        return new Promise(async (resolve) => {
            this.query(sql, variables)
            .then(res => resolve(res.rows[0]))
        })
    }
}