type LoopCallBack = (args?: Array<any>) => void;

export function Delay(ms: number): Promise<NodeJS.Timeout> { return new Promise(res => setTimeout(res, ms)) }
export async function Loop(ms: number, fn: LoopCallBack, args: Array<any> = []): Promise<void> {
    setTick(async () => 
    {
        fn(...args)
        if (ms > 0) { await Delay(ms) }
    })
}