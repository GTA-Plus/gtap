import * as GTAP from './exports';
import {Loop} from '../common'

export class Core {
  vehicles: GTAP.Vehicles
  menus: GTAP.Menus

  constructor(){
    this.vehicles = new GTAP.Vehicles
    this.menus = new GTAP.Menus(this)
    this.registerEvents()

    emitNet('GTAPlusServer:updateMoney', 100)


    Loop(0, () => {         
      if (IsControlJustReleased(0, 27)) {
        this.menus.menus['main'].open()
      } 
    })
  }
  
  registerEvents() {
    onNet('GTAPlusClient:updateMoney', (ammount: number) => {
      StatSetInt('BANK_BALANCE', ammount, true)
    })
  }
  
}