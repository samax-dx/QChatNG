import { QxPeer } from './QxPeer';
import { NOP } from 'lib/qchat/util/NOP';
import { qxpeer } from './util';


export class QxPeerCore implements QxPeer {
    private _peer: RTCPeerConnection;
    private _localuser: string;
    private _remoteuser: string

    constructor(luser: string, ruser: string) {
        var peer = this._peer = new RTCPeerConnection({
            iceServers: [
                { "urls": 'stun:stun.l.google.com:19302' },
                {
                    "urls": "turn:bu-connect.qmixin.com:3478",
                    "username": "samax",
                    "credential":"maxU92oo"
                },
            ]
        });
        peer.onicecandidate = event => {
            if (event.candidate === null) return;
            // console.log("sending ice");
            this.onice(event.candidate);
        };
        this._localuser = luser;
        this._remoteuser = ruser;
    }

    localuser: () => string = () => this._localuser;
    remoteuser: () => string = () => this._remoteuser;
    peerconn: () => RTCPeerConnection = () => this._peer;

    addIce(ice: RTCIceCandidate): Promise<void> {
        return new Promise<void>((res, rej) => {
            this._peer.addIceCandidate(
                ice
            ).then(() => {
                console.log("added ice: " + ice.sdpMid);
                res();
            }).catch(rej);
        });
    }

    onice: (ice: RTCIceCandidate) => void = NOP("onice", "QxPeerCore");

    rollback(): Promise<void> {
        if (qxpeer.sdprollback) {
            if (this._peer.signalingState === "have-local-offer")
                return this._peer.setLocalDescription({ type: "rollback" });
            if (this._peer.signalingState === "have-remote-offer")
                return this._peer.setRemoteDescription({ type: "rollback" });
        } else return Promise.resolve();
    }

    configureToMakeOffer(): Promise<void> { return Promise.resolve(); }

    createOffer(o?: RTCOfferOptions): Promise<RTCSessionDescriptionInit> {
        return this._peer.createOffer(o);
    }

    setLocalOffer(offersdp: RTCSessionDescriptionInit): Promise<void> {
        return new Promise<void>((res, rej) => {
            this._peer.setLocalDescription(
                offersdp
            ).then(() => {
                console.log("local offer set");
                res();
            }).catch(rej);
        });
    }

    setRemoteAnswer(answersdp: RTCSessionDescriptionInit): Promise<void> {
        return new Promise<void>((res, rej) => {
            this._peer.setRemoteDescription(
                answersdp
            ).then(() => {
                console.log("remote answer set");
                res();
            }).catch(rej);
        });
    }

    configureToTakeOffer(): Promise<void> { return Promise.resolve(); }

    setRemoteOffer(offersdp: RTCSessionDescriptionInit): Promise<void> {
        return new Promise<void>((res, rej) => {
            this._peer.setRemoteDescription(
                offersdp
            ).then(() => {
                console.log("remote offer set");
                res();
            }).catch(rej);
        });
    }

    createAnswer(o?: RTCOfferOptions): Promise<RTCSessionDescriptionInit> {
        return this._peer.createAnswer(o);
    }

    setLocalAnswer(answersdp: RTCSessionDescriptionInit): Promise<void> {
        return new Promise<void>((res, rej) => {
            this._peer.setLocalDescription(
                answersdp
            ).then(() => {
                console.log("local answer set");
                res();
            }).catch(rej);
        });
    }

    sendMessage(msg: object): void { }
    onmessage: (msg: object) => void = NOP("onmessage", "QxPeerCore");

    destroy(): void {
        this._peer.close();
        this._peer = null;
    }
}
