import * as GTAP from './exports';

const core = new GTAP.Core
core.menus.menus['main'].open()
emitNet('GTAPlusServer:updateMoney', 100)

onNet('GTAPlusClient:updateMoney', (ammount: number) => {
    StatSetInt('BANK_BALANCE', ammount, true)
})