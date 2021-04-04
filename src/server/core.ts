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