import * as GTAP from './exports'
import _, { delay, pick } from 'lodash'
import * as Cfx from 'fivem-js'
import { Delay, Notify } from '../common'

export enum DeliveryType {
    Postmates, 
    Van, 
    Box,
    Trailer    
}

export interface LocationData {
    name: string
    x: number
    y: number
    z: number
    truckPickup: boolean
    postmatesDropoff: boolean
    postmatesPickup: boolean
} 

export interface DeliveryData {
    pickup: LocationData
    dropoff: LocationData
    type: DeliveryType
}

export class Deliveries {
    locations: Array<LocationData>
    core: GTAP.Core
    currentDelivery: DeliveryData
    currentBlip: Cfx.Blip
    
    constructor(core: GTAP.Core){
        this.core = core

        const locationsJSON = LoadResourceFile('gtap', 'data/locations.json')
        this.locations = JSON.parse(locationsJSON)
        this.generateDeliveriesMenu()
        this.updateAllDelieveries(10)
    }

    generateDeliveriesMenu(): void {
        this.core.menus.addMenu('jobs', 'deliveryJobs', 'Delivery', 'Delviery Jobs')
        this.core.menus.addMenu('deliveryJobs', 'postmatesDelivery', 'Postmates', 'Deliveries with a personal vehicle')
        this.core.menus.addMenu('deliveryJobs', 'vanDelivery', 'Van Deliveries', 'Deliveries with a van')
        this.core.menus.addMenu('deliveryJobs', 'boxTruckDelivery', 'Box Truck Deliveries', 'Deliveries with a box truck')
        this.core.menus.addMenu('deliveryJobs', 'trailerTruckDelivery', 'Trailer Truck Deliveries', 'Deliveries with a trailer truck')
      }

    updateAllDelieveries(numberOfRoutes: number): void {
        this.updatePostmatesDeliveries(numberOfRoutes)
    }

    updatePostmatesDeliveries(numberOfRoutes: number): void {       
        this.core.menus.all.postmatesDelivery.clear()

        for(let i = 0; i < numberOfRoutes; i++) {
            const pickup = _.sample(this.locations)
            const dropoff = _.sample(this.locations)

            const btn = new Cfx.UIMenuItem(`${pickup.name} to ${dropoff.name}`)

            btn.activated.on( () => {
                this.startDelivery(pickup, dropoff, DeliveryType.Postmates)
            })

            this.core.menus.all.postmatesDelivery.addItem(btn)
        }
    }

    async goTo(location: LocationData) {
        const blip = new Cfx.Blip(AddBlipForCoord(location.x, location.y, location.z))
        blip.Sprite = Cfx.BlipSprite.PersonalVehicleCar
        blip.Name = location.name
        blip.Color = Cfx.BlipColor.Green
        blip.ShowRoute = true
        this.currentBlip = blip

        let playerIsClose = false 

        while (!playerIsClose) {
            await Delay(1)
            const playerPos = Cfx.Game.PlayerPed.Position
            if (Vdist2(playerPos.x, playerPos.y, 0, location.x, location.y, 0) < 30){
                playerIsClose = true
            }
        }
    }

    async startDelivery(pickup: LocationData, dropoff: LocationData, type: DeliveryType){
        if (_.isEqual(this.currentDelivery, {pickup: pickup, dropoff: dropoff, type: type } as DeliveryData )) {
            return null
        } else {
            if (this.currentBlip) { this.currentBlip.delete() }
        }

        await this.goTo(pickup)
        Notify('GOOD JOB BUDDY!')
    }
}