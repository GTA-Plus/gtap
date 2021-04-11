import * as GTAP from './exports';
import {Loop} from '../common'

export class Core {
  vehicles: GTAP.Vehicles
  menus: GTAP.Menus
  deliveries: GTAP.Deliveries

  constructor(){
    this.vehicles = new GTAP.Vehicles
    this.menus = new GTAP.Menus(this)
    this.registerEvents()
    this.startLoops()
    emitNet('GTAPlusServer:updateMoney', 100)

    this.deliveries = new GTAP.Deliveries(this)
  }
  
  registerEvents() {
    onNet('GTAPlusClient:updateMoney', (ammount: number) => {
      StatSetInt('BANK_BALANCE', ammount, true)
    })
  }

  startLoops() {
    Loop(0, () => {         
      if (IsControlJustReleased(0, 27)) {
        this.menus.all['main'].open()
      } 

      return false
    })
  }
  
}