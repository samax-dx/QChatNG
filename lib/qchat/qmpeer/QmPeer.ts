import { IMKit } from "./IMKit";
import { CallKit } from "./CallKit";
import { TrackInfo } from './TrackInfo';


export interface QmPeer {
    imkit: IMKit;
    callkit: CallKit;
}

export namespace QmPeer {
    export declare var onmessage: (msg: {}, sender: string) => void;
    export declare var oncall: (trackinfolist: TrackInfo[], stream: MediaStream) => Promise<void>;
}
