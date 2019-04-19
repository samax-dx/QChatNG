import { gNOP } from "../qchat/util";
import { XConnectEvent, signalx } from "../qchat/signalx";


export interface QPeer {
    localUser(): string;
    remoteUser(): string;

    peerconn(): RTCPeerConnection;
    datachannel(): RTCDataChannel | null;

    makeOffer(setFirst?: boolean): Promise<void>;
    setAnswer(data: any): Promise<void>;

    takeOffer(data: any): Promise<void>;
    sendAnswer(): void;

    onopened: () => void;
    onclosed: () => void;
}

export namespace QPeer {
    export var localuser: string;

    export const icestore = {
        add: (ruser: string, ice: RTCIceCandidate) => {
            _icestore.add(ruser, ice);
        }
    };
}

namespace qpeer {
    export function iceToJSON(candidate: RTCIceCandidate, ufrag?: string) {
        var candidatestr = candidate.candidate;
        if (ufrag) candidatestr = candidatestr + " ufrag " + ufrag;

        return JSON.stringify({
            "candidate": candidatestr,
            "sdpMid": candidate.sdpMid,
            "sdpMLineIndex": candidate.sdpMLineIndex
        });
    }

    function ufragfromsdp(sdp: RTCSessionDescriptionInit): any {
        var ufragmatches = sdp.sdp.match(/^a=ice-ufrag:.+$/gm);
        if (!ufragmatches) return;// console.warn("bad sdp: " + sdp.sdp);
        var ufrag = ufragmatches[0].split(":")[1].trim();
        return ufrag;
    }

    function ufragfromice(ice: RTCIceCandidate): any {
        var ufragmatches = ice.candidate.match(/ ufrag [^ ]+ ?/g);
        if (!ufragmatches) return;// console.warn("bad ice: " + ice.candidate);
        return ufragmatches[0].trim().split(" ")[1];
    }

    export function ufrag(
        arg: RTCSessionDescriptionInit | RTCIceCandidate
    ): any {
        if ((<RTCSessionDescription>arg).sdp) {
            return ufragfromsdp(<RTCSessionDescription>arg);
        } else return ufragfromice(<RTCIceCandidate>arg);
    }
}

export class QPeerImpl implements QPeer {
    private _peer: RTCPeerConnection;
    private _peerdc: RTCDataChannel | null;
    private _ruser: string;
    private _type: "offerer" | "answerer" | undefined;

    private _sentoffer: RTCSessionDescriptionInit | undefined;

    onopened: () => void = gNOP("ConnectionBuilder.onopened");
    onclosed: () => void = gNOP("ConnectionBuilder.onclosed");

    constructor(ruser: string) {
        var peer = new RTCPeerConnection({
            'iceServers': [
                { 'urls': 'stun:stun.stunprotocol.org:3478' },
                { 'urls': 'stun:stun.l.google.com:19302' },
            ]
        });

        peer.onicecandidate = event => {
            if (event.candidate === null) return;
            var ufrag = qpeer.ufrag(event.candidate);

            var eventType = XConnectEvent.Type.CANDIDATE;
            var candidate = qpeer.iceToJSON(event.candidate, ufrag);
            var ruser = this._ruser

            signalx.send(eventType, candidate, ruser);
        };

        peer.onconnectionstatechange = () => {
            switch (peer.connectionState) {
                case "connected":
                    //
                    break;
                case "disconnected":
                case "failed":
                    console.log("peer failed");
                    // 0+ transports terminated unexpectedly or in an error
                    break;
                case "closed":
                    console.log("onconnectionstatechange: closed");
                    this.onclosed();
                    var datach = this._peerdc;
                    if (this._peerdc) {
                        this._peerdc.close()
                        this._peerdc = null;
                    }
                    break;
            }
        };

        this._peer = peer;
        this._peerdc = null;

        this._ruser = ruser;
    }

    localUser(): string { return QPeer.localuser; }
    remoteUser(): string { return this._ruser; }

    peerconn(): RTCPeerConnection { return this._peer; }
    datachannel(): RTCDataChannel | null { return this._peerdc; }

    makeOffer(setFirst: boolean = false): Promise<void> {
        return new Promise<void>((res, rej) => {
            if (this._type && this._type === "answerer")
                return rej(Error("ConnectionBuilder is not an Offerer"));
            this._type = "offerer";

            var peer = this._peer;

            var dc = this._peerdc = peer.createDataChannel(
                this.localUser() + "~" + this._ruser
            );
            dc.onopen = () => { this.onopened(); };
            dc.onerror = event => { console.error(event.error) };

            var _offersdp: RTCSessionDescriptionInit;
            peer.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            }).then(offersdp => {
                _offersdp = offersdp;
                if (setFirst === false) {
                    this._sentoffer = offersdp;
                    return Promise.resolve();
                } else return peer.setLocalDescription(offersdp);
            }).then(() => {
                console.log("local offer-sdp set");
                signalx.send(<any>"offer", _offersdp.sdp, this._ruser);
                res();
            }).catch(err => {
                console.log("local offer-sdp error: " + err.message);
                rej(err);
            });
        });
    }

    setAnswer(answersdp: any): Promise<void> {
        return new Promise<void>((res, rej) => {
            if (this._type && this._type === "answerer")
                return rej(Error("ConnectionBuilder is not an Offerer"));
            this._type = undefined;

            var peer = this._peer;
            var setLocalDescription = () => {
                var sentoffer = this._sentoffer;
                if (sentoffer) {
                    this._sentoffer = undefined;
                    return peer.setLocalDescription(sentoffer);
                } else return Promise.resolve();
            };

            setLocalDescription(
                // void
            ).then(() => {
                return peer.setRemoteDescription(answersdp);
            }).then(() => {
                console.log("remote answer-sdp set");
                QPeer._icestore.addIceHandler(
                    this._ruser,
                    qpeer.ufrag(answersdp),
                    ice => { peer.addIceCandidate(ice).then().catch(e => 1); }
                );
                res()
            }).catch(err => {
                console.log("remote answer-sdp error: " + err.message);
                rej(err)
            });
        });
    }

    takeOffer(offersdp: any): Promise<void> {
        return new Promise<void>((res, rej) => {
            if (this._type && this._type === "offerer")
                return rej(Error("ConnectionBuilder is not an Answerer"));
            this._type = "answerer";

            var peer = this._peer;
            peer.setRemoteDescription(
                offersdp
            ).then(() => {
                console.log("remote offer-sdp set");
                QPeer._icestore.addIceHandler(
                    this._ruser,
                    qpeer.ufrag(offersdp),
                    ice => { peer.addIceCandidate(ice).then().catch(e => 1); }
                );
                peer.ondatachannel = event => {
                    var dc = this._peerdc = event.channel;
                    dc.onopen = () => { this.onopened(); };
                    dc.onerror = event => { console.error(event.error) };
                };
                res();
            }).catch(err => {
                console.log("remote offer-sdp error: " + err.message);
                rej();
            });
        });
    }

    sendAnswer(): Promise<void> {
        return new Promise<void>((res, rej) => {
            if (this._type && this._type === "offerer")
                return rej(Error("ConnectionBuilder is not an Answerer"));
            this._type = undefined;

            var peer = this._peer;
            var _answersdp: RTCSessionDescriptionInit;

            peer.createAnswer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            }).then(answersdp => {
                _answersdp = answersdp;
                return peer.setLocalDescription(
                    answersdp
                );
            }).then(() => {
                console.log("local answer-sdp set");
                signalx.send(<any>"answer", _answersdp.sdp, this._ruser);
                res();
            }).catch(err => {
                console.log("local answer-sdp error: " + err.message);
                rej(err)
            });
        });
    }
}

export namespace QPeer {
    export const _icestore = new class {
        private _icelists: { [key: string]: RTCIceCandidate[] } = {};

        private _icehandlers: {
            [key: string]: (ice: RTCIceCandidate) => void
        } = {};

        private take(
            ruser: string, ufrag: string
        ): RTCIceCandidate[] | undefined {
            var iceid = ruser + "~" + ufrag;
            var icelist = this._icelists[iceid];
            delete this._icelists[iceid];
            return icelist;
        }

        add(ruser: string, ice: RTCIceCandidate): void {
            var ufrag = qpeer.ufrag(ice);
            var iceid = ruser + "~" + ufrag;

            var icelist = this._icelists[iceid];
            if (!icelist) icelist = this._icelists[iceid] = [];

            var icehandler = this._icehandlers[iceid];
            if (icehandler) return icehandler(ice);

            icelist.push(ice);
        }

        addIceHandler(
            ruser: string,
            ufrag: string,
            handler: (ice: RTCIceCandidate) => void
        ): void {
            var handlerid = ruser + "~" + ufrag;
            this._icehandlers[handlerid] = handler;

            setTimeout(() => {
                var icelist = this.take(ruser, ufrag);
                if (icelist) icelist.forEach(ice => handler(ice));
            }, 0);
        }

        removeIceHandler(ruser: string, ufrag: string): void {
            var handlerid = ruser + "~" + ufrag;
            delete this._icehandlers[handlerid];
            this.take(ruser, ufrag);
        }
    }();
}
