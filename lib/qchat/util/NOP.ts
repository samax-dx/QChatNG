export function NOP(fn: string): () => any;
export function NOP(fn: string, cls: string): () => any;
export function NOP(fn: string, cls: string, mod: string): () => any;
export function NOP(
    fn: string, cls: string, mod: string, lvl: "error" | "warning" | "info"
): () => any;

export function NOP(
    fn: string, cls?: string, mod?: string, lvl?: "error" | "warning" | "info"
): () => any {
    var msg = "NOP! ";
    msg = msg + mod ? mod + ". " : "";
    msg = msg + cls ? cls + ". " : "";
    msg = msg + fn;
    return () => { NOP.logger(msg, lvl); };
}

export namespace NOP {
    export var logger = (msg: string, lvl?: "error" | "warning" | "info") => {
        var log: (message?: any, ...optionalParams: any[]) => void;

        switch (lvl) {
            case "error": console.error;
            case "warning": log = console.warn;
            case "info":
            default: log = console.log;
        }
        log(msg);
    };
}
