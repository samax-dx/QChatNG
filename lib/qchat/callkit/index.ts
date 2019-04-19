import { CallKit } from './CallKit';
import { signalx } from '../signalx';
import { RTCKit } from '../rtckit/RTCKit';
import { CallObserver } from './CallObserver';
import { QPeer } from '../rtckit/qpeer/QPeer';
import { CallManager } from './CallManager';


class CallManagerImpl implements CallManager {
    private _peer: QPeer;
    private _incall: boolean;

    private _localstreams: MediaStream[];
    private _remotestreams: MediaStream[];

    constructor(peer: QPeer, observer: CallObserver) {
        this._peer = peer;
        this._incall = false;

        this._localstreams = [];
        this._remotestreams = [];

        peer.onoffersent = () => { observer.onringing(); };

        peer.onanswerset = () => {
            this._incall = true;
            this._remotestreams = peer.flushRemoteStreamCache();

            observer.onstart();
            this._localstreams.forEach(stream => {
                observer.onlocalmediastream(stream);
            });
            this._remotestreams.forEach(stream => {
                observer.onremotemediastream(stream);
            });
        };

        // peer.onrollback = reason => {
        //     peer.peerconn().getReceivers().forEach(receiver => {
        //         receiver.track.stop();
        //     });
        //     peer.peerconn().getSenders().forEach(sender => {
        //         sender.track.stop();
        //         peer.peerconn().removeTrack(sender);
        //     });
        //     observer.onhangup(reason);
        // };

        peer.ondestroy = reason => {
            this._remotestreams.forEach(stream => {
                stream.getTracks().forEach(track => { track.stop(); });
            })
            this._localstreams.forEach(stream => {
                stream.getTracks().forEach(track => { track.stop(); });
            });
            observer.onhangup(reason);
        };

        peer.ontransceiverspaused = () => {
            observer.onhold();
        };

        peer.ontransceiversresumed = () => {
            observer.onunhold();
        };
    }

    addLocalMediaStream(stream: MediaStream): void {
        var localstreams = this._localstreams;

        if (localstreams.length)
            if (localstreams[localstreams.length - 1] === stream)
                return;

        localstreams.push(stream);
    }

    addRemoteMediaStream(stream: MediaStream, onok?: () => any): void {
        var remotestreams = this._remotestreams;

        if (remotestreams.length)
            if (remotestreams[remotestreams.length - 1] === stream)
                return;

        remotestreams.push(stream);
        onok();
    }

    /** can be used as canceler */
    hangup(): void {
        var peer = this._peer;
        var remoteuser = this._peer.remoteuser();

        peer.peerconn().getSenders().forEach(sender => {
            sender.track.stop();
        });
        if (!this._incall) return signalx.send("cancel", {}, remoteuser);

        console.log("hangup");
        peer.ondestroy = () => signalx.send("hangup", {}, remoteuser);
        peer.destroy("hangup");
    }

    hold(): void {
        var ontransceiverspaused = this._peer.ontransceiverspaused;
        this._peer.ontransceiverspaused = () => { };
        this._peer.pauseTransceivers();
        this._peer.ontransceiverspaused = ontransceiverspaused;
    }

    unhold(): void {
        var ontransceiversresumed = this._peer.ontransceiversresumed;
        this._peer.ontransceiversresumed = () => { };
        this._peer.resumeTransceivers();
        this._peer.ontransceiversresumed = ontransceiversresumed;
    }
}


export const callkit = new class implements CallKit {
    private _init_ok = false;

    init() {
        if (this._init_ok) return;
        this._init_ok = true;

        signalx.oncallevent = event => {
            var data = event.data;
            var ruser = event.ruser;

            var peer = RTCKit.peers().get(ruser);
            if (event.type === "dial" || event.type === "dial_rv")
                if (!peer) peer = RTCKit.peers().createpeer(ruser);

            if (!peer) return console.error("QPeer not found");

            switch (event.type) {
                case "dial":
                case "dial_rv":
                    peer.takeOffer(
                        data
                    ).then(() => {
                        var callguard: (ok: boolean) => void;
                        var onaccept = () => { callguard(true); };
                        var onreject = () => {
                            peer.rollback(
                                "reject"
                            ).then(() => {
                                //
                            }).catch(err => {
                                console.log(err);
                            });
                            signalx.send("reject", {}, ruser);
                        };

                        peer.onrollback = () => { callguard(false); };

                        callguard = CallKit.oncall(
                            ruser, event.type === "dial_rv", onaccept, onreject
                        );
                    }).catch(err => {
                        signalx.send("reject", {}, ruser);
                        console.log(err);
                    });

                    signalx.send("ackdial", {}, ruser);
                    break;
                case "ackdial":
                    peer.onoffersent();
                    break;
                case "accept":
                    peer.setAnswer(
                        data
                    ).then(() => {
                        //
                    }).catch(err => {
                        console.log(err);
                    });
                    break;
                // case "ackaccept":
                //     break;
                case "reject":
                    peer.rollback(
                        data
                    ).then(() => {
                        signalx.send("ackreject", {}, ruser);
                    }).catch(err => {
                        console.log(err);
                    });
                    break;
                // case "ackreject":
                //     break;
                // case "cancel":
                //     break
                // case "ackcancel":
                //     break;
                case "hold":
                    peer.pauseTransceivers();
                    break;
                case "unhold":
                    peer.resumeTransceivers();
                    break;
                case 'hangup':
                    peer.destroy("hangup");
                    // if (data) {
                    //     peer.takeOffer(
                    //         data
                    //     ).then(() => {
                    //         return peer.doAnswer("answer");
                    //     }).then(() => {
                    //         //
                    //     }).catch(err => {
                    //         console.error(err);
                    //     });
                    // } else peer.destroy("hangup");
                    break;
                default:
                    break;
            }
        };
    }

    makeCall(
        user: string, requestvideo: boolean, callobserver: CallObserver
    ): Promise<CallManager> {
        var peer = RTCKit.peers().get(user);
        if (!peer) peer = RTCKit.peers().createpeer(user);

        peer.onrollback = reason => {
            peer.peerconn().getSenders().forEach(sender => {
                sender.track.stop();
            });
            callobserver.onhangup(reason);
        };

        return new Promise<CallManager>((res, rej) => {
            peer.peerconn().getReceivers().forEach(receiver => {
                receiver.track.stop();
            });
            peer.peerconn().getSenders().forEach(sender => {
                sender.track.stop();
                peer.peerconn().removeTrack(sender);
            });

            navigator.mediaDevices.getUserMedia(
                { audio: true, video: requestvideo }
            ).then(mediastream => {
                var callmanager = new CallManagerImpl(peer, callobserver);
                callmanager.addLocalMediaStream(mediastream);

                mediastream.getTracks().forEach(track => {
                    callmanager.addLocalMediaStream(mediastream);
                    peer.peerconn().addTrack(track, mediastream);
                });

                setTimeout(() => {
                    peer.makeOffer(
                        requestvideo ? "dial_rv" : "dial",
                        {
                            offerToReceiveAudio: true,
                            offerToReceiveVideo: requestvideo
                        }
                    ).then(() => {
                        res(callmanager);
                    }).catch(rej);
                }, 0);
            }).catch(rej);
        });
    }

    takeCall(
        user: string, videorequested: boolean, callobserver: CallObserver
    ): Promise<CallManager> {
        var peer = RTCKit.peers().get(user);
        if (!peer) return Promise.reject("QPeer not found");

        return new Promise<CallManager>((res, rej) => {
            navigator.mediaDevices.getUserMedia(
                { audio: true, video: videorequested }
            ).then(mediastream => {
                var callmanager = new CallManagerImpl(peer, callobserver);
                callmanager.addLocalMediaStream(mediastream);

                mediastream.getTracks().forEach(track => {
                    peer.peerconn().addTrack(track, mediastream);
                });

                setTimeout(() => {
                    peer.doAnswer(
                        "accept",
                        {
                            offerToReceiveAudio: true,
                            offerToReceiveVideo: videorequested
                        }
                    ).then(() => {
                        res(callmanager);
                    }).catch(rej);
                }, 0);
            }).catch(rej);
        });
    }
}();
