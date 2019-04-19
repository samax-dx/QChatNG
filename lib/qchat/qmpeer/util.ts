export namespace qmputil {
    declare const InstallTrigger: any;

    export var sdprollback: boolean = typeof InstallTrigger !== 'undefined';

    export var datachannel: boolean = (
        RTCPeerConnection.prototype.createDataChannel ? true : false
    );

    export function canOffer(peer: RTCPeerConnection): boolean {
        var state = peer.signalingState;
        return state === "stable" || state === "have-local-offer";
    }

    export function canSetAnswer(peer: RTCPeerConnection): boolean {
        var state = peer.signalingState;
        return state === "have-local-offer" || state === "have-remote-pranswer";
    }

    export function canTakeOffer(peer: RTCPeerConnection): boolean {
        var state = peer.signalingState;
        return state === "stable" || state === "have-remote-offer";
    }

    export function canAnswer(peer: RTCPeerConnection): boolean {
        var state = peer.signalingState;
        return state === "have-remote-offer" || state === "have-local-pranswer";
    }
}
