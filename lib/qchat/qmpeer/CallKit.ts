import { TrackInfo } from './TrackInfo';


export interface CallKit {
    // remote
    ontrackadded: (trackinfo: TrackInfo | null, stream: MediaStream) => void;

    // remote
    ontrackremoved: (trackinfo: TrackInfo | null) => void;


    // user
    addtracks(tracks: MediaStreamTrack[], trackinfolist: TrackInfo[]): void;

    // user
    removetracks(trackinfolist: TrackInfo[]): void;


    // internal
    oncalling: (trackinfolist: TrackInfo[], stream: MediaStream) => void;

    // remote
    oncallended: (reason: any, trackinfolist: TrackInfo[]) => void;

    // internal
    onreconnecting: () => void;

    // remote
    onreconnectfailed: (trackinfolist: TrackInfo[]) => void;

    // user
    endcall(): void;

    // user
    holdcall(): void;

    // user
    unholdcall(): void;


    // remote
    oncallheld: () => void;

    // remote
    oncallunhold: () => void;
}
