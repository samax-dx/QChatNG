import { PeerRegistry } from './PeerRegistry';

export interface RTCKit {
    init(): void;
}

export namespace RTCKit {
    export function peers(): PeerRegistry { return PeerRegistry.create(); }

    export declare var onpeermessage: (user: string, msg: object) => void;
    export declare var sendmessagealt: (user: string, msg: object) => void;
}
