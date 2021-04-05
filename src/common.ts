type WaitCallBack = (args?: Array<any>) => void;

export function Wait(ms: number) { return new Promise(res => setTimeout(res, ms)) }
export async function Loop(ms: number, fn: WaitCallBack, args: Array<any> = []) {
    setTick(async () => 
    {
        fn(...args)
        if (ms > 0) { await Wait(ms) }
    })
}