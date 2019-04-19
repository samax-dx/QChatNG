import { QxPeerV1 } from "./qxpeer";
import { QPeer } from './QPeer';
import { signalx, XChannelEvent } from 'lib/qchat/signalx';


export class QPeerImpl implements QPeer {
    private _peer: QxPeerV1;
    private _remotestreams: MediaStream[] = [];

    private static iceToData(candidate: RTCIceCandidate) {
        return {
            "candidate": candidate.candidate,
            "sdpMid": candidate.sdpMid,
            "sdpMLineIndex": candidate.sdpMLineIndex
        };
    }

    constructor(luser: string, ruser: string) {
        var peer = this._peer = new QxPeerV1(luser, ruser);
        peer.onice = ice => {
            signalx.send("candidate", QPeerImpl.iceToData(ice), ruser);
        };
        peer.onmessage = msg => { QPeer.onpeermessage(ruser, msg); };
        peer.sendmessagealt = msg => { QPeer.sendmessagealt(ruser, msg); };
        peer.peerconn().ontrack = event => {
            event.streams.forEach(stream => {
                this._remotestreams.push(stream)
            });
        };
    }

    localuser: () => string = () => this._peer.localuser();
    remoteuser: () => string = () => this._peer.remoteuser();
    peerconn: () => RTCPeerConnection = () => this._peer.peerconn();

    flushRemoteStreamCache(): MediaStream[] {
        var streams = this._remotestreams;
        this._remotestreams = [];
        return streams;
    }

    makeOffer(
        type: XChannelEvent.Type, options?: RTCOfferOptions
    ): Promise<void> {
        return new Promise<void>((res, rej) => {
            var peer = this._peer;
            var offer: RTCSessionDescriptionInit;

            peer.configureToMakeOffer(
                // void
            ).then(() => {
                return peer.createOffer(options);
            }).then(offersdp => {
                offer = offersdp;
                return peer.setLocalOffer(offer);
            }).then(() => {
                signalx.send(type, offer, this.remoteuser());
                res();
            }).catch(rej);
        });
    }

    onoffersent: () => void = () => {};

    setAnswer(answersdp: RTCSessionDescriptionInit): Promise<void> {
        return new Promise<void>((res, rej) => {
            var peer = this._peer;

            peer.setLocalOffer(
                // void
            ).then(() => {
                return peer.setRemoteAnswer(answersdp);
            }).then(() => {
                setTimeout(this.onanswerset, 0);
                res();
            }).catch(rej);

            // peer.setRemoteAnswer(
            //     answersdp
            // ).then(() => {
            //     setTimeout(this.onanswerset, 0);
            //     res();
            // }).catch(rej);
        });
    }

    takeOffer(offersdp: RTCSessionDescriptionInit): Promise<void> {
        return new Promise<void>((res, rej) => {
            var peer = this._peer;

            peer.configureToTakeOffer(
                // void
            ).then(() => {
                return peer.setRemoteOffer(offersdp);
            }).then(res).catch(rej);
        });
    }

    doAnswer(
        type: XChannelEvent.Type, options?: RTCOfferOptions
    ): Promise<void> {
        return new Promise<void>((res, rej) => {
            var peer = this._peer;
            var answer: RTCSessionDescriptionInit;

            peer.setRemoteOffer(
                // void
            ).then(() => {
                return peer.createAnswer(options);
            }).then(answersdp => {
                answer = answersdp;
                return peer.setLocalAnswer(answersdp);
            }).then(() => {
                signalx.send(type, answer, this.remoteuser());
                setTimeout(this.onanswerset, 0);
                res();
            }).catch(rej);
        });
    }

    onanswerset: () => void = () => { };

    rollback(reason: any): Promise<void> {
        return new Promise<void>((res, rej) => {
            setTimeout(() => { this.onrollback(reason) }, 0);
            this._peer.rollback(
                //
            ).then(
                () => { res(reason); }
            ).catch(rej);
        });
    }
    onrollback: (reason: any) => void;

    addIce(ice: RTCIceCandidate): Promise<void> {
        return this._peer.addIce(ice);
    }

    sendMessage(msg: object): void { this._peer.sendMessage(msg); }
    onmessage: (msg: object) => void;

    pauseTransceivers(): void {
        setTimeout(this.ontransceiverspaused, 0);
    }
    ontransceiverspaused: () => void;

    resumeTransceivers(): void {
        setTimeout(this.ontransceiversresumed, 0);
    }
    ontransceiversresumed: () => void;

    destroy(reason: any): void {
        var ondestroy = this.ondestroy;
        this._peer.destroy();
        this._peer = null;
        setTimeout(() => { ondestroy(reason); }, 0);
    }
    ondestroy: (reason: any) => void;
}
