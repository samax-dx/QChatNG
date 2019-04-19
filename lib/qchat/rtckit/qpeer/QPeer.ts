import { XChannelEvent } from 'lib/qchat/signalx';


export interface QPeer {
    localuser: () => string;
    remoteuser: () => string;
    peerconn: () => RTCPeerConnection;

    flushRemoteStreamCache(): MediaStream[];

    makeOffer(
        type: XChannelEvent.Type, options?: RTCOfferOptions
    ): Promise<void>;

    onoffersent: () => void;

    setAnswer(answersdp: RTCSessionDescriptionInit): Promise<void>;

    takeOffer(offersdp: RTCSessionDescriptionInit): Promise<void>;

    doAnswer(
        type: XChannelEvent.Type, options?: RTCOfferOptions
    ): Promise<void>;

    onanswerset: () => void;

    rollback(reason: any): Promise<void>;
    onrollback: (reason: any) => void;

    addIce(ice: RTCIceCandidate): Promise<void>;

    sendMessage(msg: object): void;

    pauseTransceivers(): void;
    ontransceiverspaused: () => void;
    resumeTransceivers(): void;
    ontransceiversresumed: () => void;

    destroy(reason: any): void;
    ondestroy: (reason: any) => void;
}

export namespace QPeer {
    export declare var onpeermessage: (user: string, msg: object) => void;
    export declare var sendmessagealt: (user: string, msg: object) => void;
}
