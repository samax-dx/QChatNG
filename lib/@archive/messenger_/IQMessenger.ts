export interface IQMessenger {
    makeOffer(): Promise<RTCSessionDescriptionInit>;

    setAnswer(answersdp: RTCSessionDescriptionInit): Promise<void>;

    takeOffer(offersdp: RTCSessionDescriptionInit): Promise<void>;

    doAnswer(): Promise<RTCSessionDescriptionInit>;

    cancelOffer(): Promise<void>;

    addIce(ice: RTCIceCandidate): Promise<void>;
}
