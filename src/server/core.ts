import * as GTAPlusServer from './exports'
import * as Cfx from 'fivem-js'
import { Player } from 'fivem-js'

export class Core {
    db: GTAPlusServer.Database

    constructor(){
        this.db = new GTAPlusServer.Database
        this.registerEvents()
    }

    async registerEvents(): Promise<void> {
        onNet('playerConnecting', () => {
            this.db.sync.execute('INSERT IGNORE INTO users(game_license) VALUES (?)',[this.getGameLicense()] )
        })

        onNet('GTAPlusServer:updateMoney', async (difference: number) => {
            const lic = this.getGameLicense()
            const roundedDifference = Math.round(difference)

            await this.db.async.execute('UPDATE users SET bank = bank + ? WHERE game_license = ?', [roundedDifference, lic])
            const [rows, fields] = await this.db.async.execute('SELECT bank from users WHERE game_license = ?', [lic] )
            console.log('HERE')
            console.log(rows[0].bank)
            emitNet('GTAPlusClient:updateMoney', source, rows[0].bank)
        })
    }

    getGameLicense(): string {
        const numID = GetNumPlayerIdentifiers(source)

        const licenseRegex = /(?<=license:).*/g

        for(let i = 0; i < numID; i++) {
            const idString = GetPlayerIdentifier(source, i)

            const licenseMatch = idString.match(licenseRegex)
            
            if (licenseMatch){
                return licenseMatch[0]
            }           
        }
    }
}