import { qxpeer } from '../qchat/peer/util';
import { OfferKitLocal, OfferKitRemote } from './offerkits';


export abstract class QPeerBase {
    private _peer: RTCPeerConnection;
    private _ruser: string;

    private _lofferkit = new OfferKitLocal();
    private _rofferkit = new OfferKitRemote();

    constructor(ruser: string) { // qpeer.sdprollback = ruser === "w1";console.log(qpeer.sdprollback);
        var peer = new RTCPeerConnection({
            'iceServers': [
                { 'urls': 'stun:stun.stunprotocol.org:3478' },
                { 'urls': 'stun:stun.l.google.com:19302' },
            ]
        });
        this._peer = peer;
        this._ruser = ruser;
    }

    localUser(): string { return qxpeer.localuser; }

    remoteUser(): string { return this._ruser; }

    peerconn(): RTCPeerConnection { return this._peer; }

    makeOffer(): Promise<RTCSessionDescriptionInit> {
        var peer = this._peer;
        var offer: RTCSessionDescriptionInit;

        if (!qxpeer.canOffer(peer))
            return Promise.reject("QPeer can't make Offerer");
        this.onreadymakeoffer();

        return new Promise<RTCSessionDescriptionInit>((res, rej) => {
            peer.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            }).then(offersdp => {
                offer = offersdp;
                return this._lofferkit.trysetoffer(peer, offersdp, () => {
                    console.log("local offer set");
                });
            }).then(() => {
                res(offer);
            }).catch(rej);
        });
    }

    setAnswer(answersdp: RTCSessionDescriptionInit): Promise<void> {
        var peer = this._peer;

        if (!qxpeer.canOffer(peer) && !qxpeer.canSetAnswer(peer))
            return Promise.reject("QPeer can't make Offer or set Answer");

        return new Promise<void>((res, rej) => {
            this._lofferkit.setoffer(
                peer
            ).then(() => {
                return peer.setRemoteDescription(answersdp);
            }).then(() => {
                console.log("remote answer set");
                res();
            }).catch(rej);
        });
    }

    takeOffer(offersdp: RTCSessionDescriptionInit): Promise<void> {
        var peer = this._peer;

        if (!qxpeer.canTakeOffer(peer))
            return Promise.reject("QPeer can't take Offer");
        this.onreadytakeoffer();

        return new Promise<void>((res, rej) => {
            this._rofferkit.trysetoffer(peer, offersdp, () => {
                console.log("remote offer set");
            }).then(res).catch(rej);
        });
    }

    doAnswer(): Promise<RTCSessionDescriptionInit> {
        var peer = this._peer;
        var answer: RTCSessionDescriptionInit;

        if (!qxpeer.canTakeOffer(peer) && !qxpeer.canAnswer(peer))
            return Promise.reject("QPeer can't take Offer or set Answer");

        return new Promise<RTCSessionDescriptionInit>((res, rej) => {
            this._rofferkit.setoffer(
                peer
            ).then(() => {
                return peer.createAnswer({
                    offerToReceiveAudio: true, offerToReceiveVideo: true
                });
            }).then(answersdp => {
                answer = answersdp;
                return peer.setLocalDescription(answersdp);
            }).then(() => {
                console.log("local answer set");
                res(answer);
            }).catch(rej);
        });
    }

    cancelOffer(): Promise<void> {
        return new Promise<void>((res, rej) => {
            var peer = this._peer;

            if (qxpeer.canSetAnswer(peer)) {
                if (qxpeer.sdprollback) peer.setLocalDescription(
                    { type: "rollback" }
                ).then(res).catch(rej);
            } else if (qxpeer.canAnswer(peer)) {
                if (qxpeer.sdprollback) peer.setRemoteDescription(
                    { type: "rollback" }
                ).then(res).catch(rej);
            } else rej("QPeer state invalid");
        });
    }

    destroy(): void {
        this._peer.close();
        this._peer = null;
    }

    protected abstract onreadymakeoffer(): void;
    protected abstract onreadytakeoffer(): void;
}
