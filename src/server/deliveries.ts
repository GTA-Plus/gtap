import {Loop} from '../common'


export class Deliveries {
    locations: any
    date: Date
    seed: number

    constructor() {
        this.locations = JSON.parse(LoadResourceFile('gtap', 'data/locations.json'))

        this.registerEvents()

        Loop(900_000, () => {
            const d = new Date()
            this.seed = d.getTime()
            emitNet('gtapClient:updateAllDeliveries', -1, this.seed  )
        })
    }

    registerEvents(): void {
        onNet('gtapServer:getAllDeliveries', () => {
            emitNet('gtapClient:updateAllDeliveries', source, this.seed  )
        })
    }
}


