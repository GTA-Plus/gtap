import * as GTAPlusServer from './exports'

export class Core {
    db: GTAPlusServer.Database

    constructor(){
        this.db = new GTAPlusServer.Database
        this.registerEvents()
    }

    async registerEvents(): Promise<void> {
        onNet('playerConnecting', async () => {
            await this.db.query('INSERT INTO users(game_license) VALUES ($1) ON CONFLICT DO NOTHING',[this.getGameLicense()])
        })

        onNet('GTAPlusServer:updateMoney', async (difference: number) => {
            const results = await this.db.getFirst(
                'UPDATE users SET bank = bank + $1 WHERE game_license = $2 RETURNING bank', 
                [Math.round(difference), this.getGameLicense()]
                )
                
            emitNet('GTAPlusClient:updateMoney', source, results.bank)
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