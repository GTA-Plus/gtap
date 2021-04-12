import _ from "lodash";
import * as Cfx from 'fivem-js';

export interface VehicleData {
    price: number
    model: string
    name: string
    type: string
    make: string
  }

export class Vehicles {
    all: Array<VehicleData>

    constructor() {
        this.getall()
    }

    getall(): void {
        const file = LoadResourceFile(GetCurrentResourceName(),"data/vehicles.json")
        
        const vehiclesParsed = JSON.parse(file)

        this.all = []

        _.forOwn( vehiclesParsed, (cJson, vClass) => { 

        _.forOwn( cJson, (vJson, vName) => {
            if (vJson.model !== undefined){
            this.all.push( 
                {
                price: vJson.price,
                model: vJson.model,
                name: vName,
                type: vClass,
                make: vJson.manufacturer
                } as VehicleData)
            }
            
        })

        })

    }

    stringify(vehicle: Cfx.Vehicle): string {
        const modObj = {}
            
        Object.getOwnPropertyNames(Cfx.VehicleModCollection.prototype).forEach(name => {
          const val = vehicle.Mods[name]
          if (typeof(val) == 'function') {return null}
          modObj[name] = val
        })

        for(const modType in Cfx.VehicleModType) {
          if (!isNaN(Number(modType))) {
            modObj[modType] = vehicle.Mods.hasVehicleMod(Number(modType))
          }
        }

        return JSON.stringify(modObj)
    }

}