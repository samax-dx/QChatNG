export enum InvitationState {
    /**
     * RTCPeerConnection.createOffer()
     */
    CREATE,
    /**
     * RTCPeerConnection.setLocalDescription()
     */
    APPLY,
    /**
     * RTCPeerConnection.setRemoteDescription()
     */
    FINALIZE
}

export interface InvitationError {
    state: InvitationState;
    error: any;
}


export enum JoinState {
    /**
     * RTCPeerConnection.setRemoteDescription()
     */
    APPLY,
    /**
     * RTCPeerConnection.createAnswer()
     */
    CREATE,
    /**
     * RTCPeerConnection.setLocalDescription()
     */
    FINALIZE
}

export interface JoinError {
    state: JoinState;
    error: any;
}
