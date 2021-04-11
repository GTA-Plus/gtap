type LoopCallBack = (args?: Array<any>) => boolean;

export function Delay(ms: number) { return new Promise(res => setTimeout(res, ms)) }
export async function Loop(ms: number, fn: LoopCallBack, args: Array<any> = []) {
    const currentLoop = setTick(async () => 
    {
        if (fn(...args)) {clearTick(currentLoop)}
        if (ms > 0) { await Delay(ms) }
    })
}

export function Notify(str: string) {
    BeginTextCommandThefeedPost("STRING")
    AddTextComponentSubstringPlayerName(str)
    EndTextCommandThefeedPostTicker(true, false)
}