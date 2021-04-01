import * as Cfx from 'fivem-js';
import _ from "lodash";
import * as GTAP from './exports'

interface MenuObject {
    [key: string]: Cfx.Menu;
}

export class Menus {
    menus: MenuObject
    core: GTAP.Core

    constructor(core: GTAP.Core) {
      this.core = core
      this.generateMainMenu()
    }

    populateVehicleMenu(parentMenuName: string, vehicles: Array<GTAP.VehicleData>): void {
        this.addMenu(parentMenuName, parentMenuName + 'ByClass', 'By Class', 'Sort Vehicles By Class')
        this.addMenu(parentMenuName, parentMenuName + 'ByMake', 'By Make', 'Sort Vehicles By Make')
    
        _.sortBy(vehicles, ['type', 'name']).forEach( (vehicle) => {
          if (this.menus[parentMenuName + vehicle.type] === undefined){
            this.addMenu(parentMenuName +  'ByClass', parentMenuName + vehicle.type, vehicle.type, 'Vehicles in ' + vehicle.type )
          }
    
          const vBtn = new Cfx.UIMenuItem(vehicle.name)
          
          vBtn.activated.on(  async () => {
            const playerCoords = Cfx.Game.PlayerPed.Position;
            const spawnVehicle = await Cfx.World.createVehicle(new Cfx.Model(vehicle.model), playerCoords);
            Cfx.Game.PlayerPed.setIntoVehicle(spawnVehicle, Cfx.VehicleSeat.Driver);
          })
    
          if (vehicle.price !== undefined ){
            vBtn.RightLabel = '$' + vehicle.price.toLocaleString()
          }
          
          this.menus[parentMenuName + vehicle.type].addItem(vBtn)
        })
      }
    
      generateMainMenu(): void {
        this.menus = {} as MenuObject
        this.menus['main'] = new Cfx.Menu('GTA Plus', 'Main Menu')
        this.addMenu('main', 'vehicles', 'Vehicles', 'Vehicles Menu')
        this.addMenu('vehicles', 'vehicleSpawner', 'Vehicle Spawner', 'Vehicle Spawn Menu')
        this.populateVehicleMenu('vehicleSpawner', this.core.vehicles.allVehicles)
      }
    
      addMenu(parent: string, namespace: string, title: string, description: string ): Cfx.Menu {
        return this.menus[namespace] = this.menus[parent].addNewSubMenu(title, description)
      }
}