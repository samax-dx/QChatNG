import { CallKit } from './CallKit';
import { IMKit } from './IMKit';
import { QmPeer } from './QmPeer';
import { TrackInfo } from './TrackInfo';
import { qmputil } from './util';


class SignalR {
    connect(
        ruser: string, offersdp: RTCSessionDescriptionInit
    ): Promise<RTCSessionDescriptionInit> {
        return new Promise<RTCSessionDescriptionInit>((res, rej) => {
            //
        });
    }
}

const signalr = new SignalR();


class IMKitImpl implements IMKit {
    private _user: string;
    private _pc: RTCPeerConnection;
    private _channel: RTCDataChannel | null = null;

    private _msgob: {}[] = [];

    constructor(user: string, pc: RTCPeerConnection) {
        this._user = user;
        this._pc = pc;

        if (!pc.ondatachannel) return

        pc.ondatachannel = event => {
            var channel = this._channel = event.channel;

            channel.onmessage = event => {
                var msg = JSON.parse(event.data);
                this.onmessage(msg);
            };

            channel.onopen = () => {
                this._msgob.forEach(
                    msg => { channel.send(JSON.stringify(msg)); }
                );
            };
        };
    }

    sendMessage(msg: {}): void {
        var channel = this._channel;

        if (channel) {
            if (channel.readyState === "open") {
                channel.send(JSON.stringify(msg));
                return;
            } else this._msgob.push(msg);
        } else {
            // this._sendxc(msg);

            if (0/* can_use_datachannel */)
                this._channel = this._pc.createDataChannel(this._user);
        }
    }

    onmessage: (msg: {}) => void = <any>null;

    createDataChannel() {
        if (this._channel) return;

        if (0/* can_use_datachannel */)
            this._channel = this._pc.createDataChannel(this._user);
    }

    // pc.createOffer(offerOptions)
    //     .then(d => pc.setLocalDescription(d))
    //     .then(() => signalr.connect("", pc.localDescription))
    //     .then(d => pc.setRemoteDescription(d))
    //    
}


class CallKitImpl implements CallKit {
    private _user: string;
    private _pc: RTCPeerConnection;

    private _senders: { [key: string]: RTCRtpSender } = {};

    constructor(user: string, pc: RTCPeerConnection) {
        this._user = user;
        this._pc = pc;

        pc.ontrack = event => {
            event.streams.forEach(stream => {
                stream.getTracks().forEach(track => {
                    var trackinfo = { id: track.id, label: "" };

                    track.onended = event => this.ontrackremoved(trackinfo);

                    this.ontrackadded(trackinfo, stream);
                });
            });
        };
    }

    // remote
    ontrackadded: (trackinfo: TrackInfo | null, stream: MediaStream) => void;

    // remote
    ontrackremoved: (trackinfo: TrackInfo | null) => void;


    // user
    addtracks(tracks: MediaStreamTrack[], trackinfolist: TrackInfo[]): void {
        var stream = new MediaStream();
        tracks.forEach(track => {
            this._senders[track.id] = this._pc.addTrack(track, stream);
        });
    }

    // user
    removetracks(trackinfolist: TrackInfo[]): void {
        trackinfolist.forEach(trackinfo => {
            this._pc.removeTrack(this._senders[trackinfo.id]);
        });
    }


    // internal <-- call from onnegotiationneeded
    oncalling: (trackinfolist: TrackInfo[], stream: MediaStream) => void;

    // remote <-- call from signalx
    oncallended: (reason: any, trackinfolist: TrackInfo[]) => void;

    // internal <-- call from onnegotiationneeded
    onreconnecting: () => void;

    // remote <-- call from signalx
    onreconnectfailed: (trackinfolist: TrackInfo[]) => void;

    // user
    endcall(): void {
        //
    }

    // user
    holdcall(): void {
        //
    }

    // user
    unholdcall(): void {
        //
    }


    // remote
    oncallheld: () => void;

    // remote
    oncallunhold: () => void;
}


class QmPeerImpl implements QmPeer {
    private _pc: RTCPeerConnection;

    imkit: IMKit;
    callkit: CallKit;

    constructor(user: string, remoteOffer?: RTCSessionDescriptionInit) {
        var pc = this._pc = new RTCPeerConnection();

        this.imkit = new class extends IMKitImpl {
            constructor(user: string, pc: RTCPeerConnection) {
                super(user, pc);
                if (!remoteOffer) super.createDataChannel();
            }
        }(user, pc);

        this.callkit = new CallKitImpl(user, pc);
    }

    update(remoteOffer: RTCSessionDescriptionInit) {
        return this;
    }
}


class QmPeerRegistry {
    private _peers: { [key: string]: QmPeerImpl } = {};

    get(user: string, remoteOffer?: RTCSessionDescriptionInit): QmPeer {
        var peer = this._peers[user];

        if (peer) return peer.update(remoteOffer);
        return this._peers[user] = new QmPeerImpl(user, remoteOffer);
    }
}


export namespace qmpeer {
    const registry = new QmPeerRegistry();

    export function setOnMessageListener(
        listener: (msg: {}, sender: string) => void
    ): void {
        QmPeer.onmessage = listener;
    }

    export function setOnCallListener(
        listener: (
            trackinfolist: TrackInfo[], stream: MediaStream
        ) => Promise<void>
    ): void {
        QmPeer.oncall = listener;
    }

    export function imkit(
        user: string, remoteOffer?: RTCSessionDescriptionInit
    ): IMKit {
        return registry.get(user, remoteOffer).imkit;
    }

    export function callkit(
        user: string, remoteOffer?: RTCSessionDescriptionInit
    ): CallKit {
        return registry.get(user, remoteOffer).callkit;
    }
}
