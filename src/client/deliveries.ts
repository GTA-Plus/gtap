import * as GTAP from './exports'
import * as Cfx from 'fivem-js'
import { Delay } from '../common'
import Prando from 'prando'
import _ from 'lodash'

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
    deliveryRNG: Prando
    
    constructor(core: GTAP.Core){
        this.core = core

        const locationsJSON = LoadResourceFile('gtap', 'data/locations.json')
        this.locations = JSON.parse(locationsJSON)
        this.generateDeliveriesMenu()
        this.registerEvents()

        emitNet('gtapServer:getAllDeliveries')
    }

    registerEvents(): void {
        onNet('gtapClient:updateAllDeliveries', (seed: number) => {
            this.deliveryRNG = new Prando(seed)
            this.updateAllDelieveries(10)
        } )
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

        this.core.notify('New deliviers are now available!')
    }

    updatePostmatesDeliveries(numberOfRoutes: number): void {       
        this.core.menus.all.postmatesDelivery.clear()
        for(let i = 0; i < numberOfRoutes; i++) {
            const locLength = this.locations.length

            const pickup = this.locations[this.deliveryRNG.nextInt(0, locLength-1)];
            const dropoff = this.locations[this.deliveryRNG.nextInt(0, locLength-1)];

            const btn = new Cfx.UIMenuItem(`${pickup.name} to ${dropoff.name}`)

            btn.activated.on( () => {
                this.startDelivery(pickup, dropoff, DeliveryType.Postmates)
            })

            this.core.menus.all.postmatesDelivery.addItem(btn)
        }
    }

    async goTo(location: LocationData): Promise<void> {
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

    async startDelivery(pickup: LocationData, dropoff: LocationData, type: DeliveryType): Promise<void> { 
        if (_.isEqual(this.currentDelivery, {pickup: pickup, dropoff: dropoff, type: type } as DeliveryData )) {
            return null
        } else {
            if (this.currentBlip) { this.currentBlip.delete() }
        }

        await this.goTo(pickup)
        this.core.notify('Delivery items picked up! Proceed to dropoff desintation to complete delivery.')
        this.currentBlip.delete()

        await this.goTo(dropoff)
        this.core.notify('Delivery complete!')
    }
}