export abstract class QPeerConnWatcher {
    constructor() {
        var peer = this.peerconn();

        peer.oniceconnectionstatechange = event => {
            if (peer.iceConnectionState === "failed") { // state be stable
                console.log(peer.signalingState);
            } else if (peer.iceConnectionState === "disconnected") {
                // network error ??
            } else if (peer.iceConnectionState === "closed") {
                // Handle the failure
                this.onclosed();
            } else if (peer.iceConnectionState === "connected") { // state be stable
                this.onopened();
            } else console.log("unhandled iceConnectionState");
        };
    }

    abstract peerconn(): RTCPeerConnection;
    abstract remoteuser(): string;

    abstract onopened: () => void;
    abstract onclosed: () => void;
}
