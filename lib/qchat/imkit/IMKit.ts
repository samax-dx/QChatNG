export interface IMKit {
    init(): void;
    sendmessage(user: string, msg: object): void;
}

export namespace IMKit {
    export declare var onmessage: (user: string, msg: object) => void;
}
