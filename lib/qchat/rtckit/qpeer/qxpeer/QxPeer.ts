export interface QxPeer {
    peerconn: () => RTCPeerConnection;
    localuser: () => string;
    remoteuser: () => string;

    configureToMakeOffer(): Promise<void>;
    createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;
    setLocalOffer(offersdp: RTCSessionDescriptionInit): Promise<void>;
    setRemoteAnswer(answersdp: RTCSessionDescriptionInit): Promise<void>;

    configureToTakeOffer(): Promise<void>;
    setRemoteOffer(offersdp: RTCSessionDescriptionInit): Promise<void>;
    createAnswer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;
    setLocalAnswer(answersdp: RTCSessionDescriptionInit): Promise<void>;

    addIce(ice: RTCIceCandidate): Promise<void>;
    onice: (ice: RTCIceCandidate) => void;

    rollback(): Promise<void>;

    sendMessage(msg: object): void;
    onmessage: (msg: object) => void;

    destroy(): void;
}
