import * as GTAP from './exports';

export class Core {
  vehicles: GTAP.Vehicles
  menus: GTAP.Menus

  constructor(){
    this.vehicles = new GTAP.Vehicles
    this.menus = new GTAP.Menus(this)
  }
  
  
}