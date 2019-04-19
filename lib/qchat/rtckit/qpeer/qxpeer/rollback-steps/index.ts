export class RollbackHelper {
    _features: { canRollback: boolean, alwaysAccepts: boolean };
    _peer: RTCPeerConnection;

    constructor(peer: RTCPeerConnection) {
        this._features = { canRollback: false, alwaysAccepts: false };
        this._peer = peer;
    }

    removeSenders(): void {
        if (this._features.canRollback) return;

        this._peer.getSenders().forEach(sender => {
            sender.track.stop();
            this._peer.removeTrack(sender);
        });
    }

    stopReceivers(): void {
        if (this._features.canRollback) return;

        this._peer.getReceivers().forEach(receiver => {
            receiver.track.stop();
        });
    }

    rollback(): void {
        this.removeSenders();
        this.stopReceivers();
    }
}
