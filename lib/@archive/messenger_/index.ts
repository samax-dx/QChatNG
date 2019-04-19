import { IQMessenger } from './IQMessenger';
import { IQMessengerCore } from './IQMessengerCore';
import { Registry } from './registry';

import { QPeer } from '../qpeer';
import { SessionIB, SessionOB, TextSessionOB } from "./Session"


export interface QMessenger extends IQMessenger { }

export namespace QMessenger {
    const registry = new Registry();


    export function init(
        user: string, icehandler: (user: string, ice: RTCIceCandidate) => void
    ): void {
        QPeer.config
            .setLocalUser(user)
            .setIceSender(icehandler)
            .setMessageHandler((user, msg) => { onmessage(user, msg); });
    }


    /** basic */
    export function get(user: string): Promise<QMessenger>;

    /** for creating. returns previous messenger if exists. */
    export function get(
        user: string, session: SessionOB | SessionIB
    ): Promise<QMessenger>;

    /** for negotiating */
    export function get(
        user: string, session: SessionOB | SessionIB, negotiating?: boolean
    ): Promise<QMessenger>;

    export function get(
        user: string, session?: SessionOB | SessionIB, negotiating = false
    ): Promise<QMessenger> {
        return registry.get(user, session, negotiating);
    }


    export var onmessage: (user: string, msg: object) => void = () => {
        console.log("NOP!! QMessenger.onmessage");
    };

    export function sendmessage(user: string, msg: object): void {
        get(
            user, new TextSessionOB()
        ).then(messenger => {
            (<IQMessengerCore>messenger).peer.sendmessage(msg);
        }).catch(err => {
            console.error(err);
        });
    }


    export interface CallManager {
        videoEnabled?: boolean;
        localMPC: HTMLElement;
        remoteMPC: HTMLElement;

        onRinging: () => void;

        holdCall(): void;
        onCallHold: () => void;

        unhodCall(): void;
        onCallUnhold: () => void;

        endCall(): void;
        onCallEnded: () => void;
    }

    // wrap this callback for creating callmanager on-init?
    export var oncall: (
        user: string,
        sigAccept: () => void,
        sigReject: () => void,
        videoEnabled?: boolean
    ) => void = () => {
        console.log("NOP!! QMessenger.onCall");
    };

    // must create callmanager here
    export function makecall(
        user: string,
        onAccepted: () => void,
        onRejected: (reason: any) => void,
        videoEnabled?: boolean
    ): void {
        console.log("NOP!! QMessenger.doCall");
    }
}

export {
    SessionIB,
    TextSessionIB,
    CallSessionIB,
    SessionOB,
    CallSessionOB,
    TextSessionOB
} from './Session'




//import { gNOP } from './util';
// import { QPeer } from "../qpeer";
// import { signalx } from '../signal';

// export interface QMessenger {
//     makeOffer(): Promise<RTCSessionDescriptionInit>;

//     setAnswer(answersdp: RTCSessionDescriptionInit): Promise<void>;

//     takeOffer(offersdp: RTCSessionDescriptionInit): Promise<void>;

//     doAnswer(): Promise<RTCSessionDescriptionInit>;

//     cancelOffer(): Promise<void>;

//     addIce(ice: RTCIceCandidate): Promise<void>;

//     ring(): Promise<void>;
// }


// class QMessengerImpl implements QMessenger {
//     peer: QPeer;

//     constructor(user: string) {
//         this.peer = QPeer(user);
//         this.peer.onmessage = msg => { QMessenger.onmessage(user, msg); };
//     }


//     makeOffer(): Promise<RTCSessionDescriptionInit> {
//         return this.peer.makeOffer();
//     }

//     setAnswer(answersdp: RTCSessionDescriptionInit): Promise<void> {
//         return this.peer.setAnswer(answersdp);
//     }

//     takeOffer(offersdp: RTCSessionDescriptionInit): Promise<void> {
//         return this.peer.takeOffer(offersdp);
//     }

//     doAnswer(): Promise<RTCSessionDescriptionInit> {
//         return this.peer.doAnswer();
//     }

//     cancelOffer(): Promise<void> {
//         return this.peer.cancelOffer();
//     }

//     addIce(ice: RTCIceCandidate): Promise<void> {
//         return this.peer.addIce(ice);
//     }


//     ring(): Promise<void> {
//         return new Promise<void>((res, rej) => {
//             //
//         });
//     }
// }


// export namespace QMessenger {
//     const messengers: { [key: string]: QMessenger } = {};
//     function QMessenger(user: string): QMessenger {
//         return messengers[user] = new QMessengerImpl(user);
//     }

//     export function init(
//         user: string, icehandler: (user: string, ice: RTCIceCandidate) => void
//     ): void {
//         QPeer.init(user, icehandler);
//     }


//     export interface SessionOB { }
//     export interface SessionIB { offersdp: RTCSessionDescriptionInit; }

//     export class TextSessionOB implements SessionOB { }
//     export class CallSessionOB implements SessionOB {
//         constructor(public enableVideo: boolean = false) { }
//     }

//     export class TextSessionIB implements SessionIB {
//         constructor(public offersdp: RTCSessionDescriptionInit) { }
//     }
//     export class CallSessionIB implements SessionIB {
//         constructor(
//             public offersdp: RTCSessionDescriptionInit,
//             public enableVideo: boolean = false
//         ) { }
//     }


//     /** basic */
//     export function get(user: string): Promise<QMessenger>;

//     /** for creating. returns previous messenger if exists. */
//     export function get(
//         user: string, session: SessionOB | SessionIB
//     ): Promise<QMessenger>;

//     /** for negotiating */
//     export function get(
//         user: string, session: SessionOB | SessionIB, negotiating?: boolean
//     ): Promise<QMessenger>;


//     export function get(
//         user: string, session?: SessionOB | SessionIB, negotiating = false
//     ): Promise<QMessenger> {
//         var messenger = messengers[user];

//         if (session && negotiating) {
//             if (!messenger) return Promise.reject("messenger not found");
//         } else if (session) {
//             if (messenger) return Promise.resolve(messenger);
//             else messenger = QMessenger(user);
//         } else {
//             if (messenger) return Promise.resolve(messenger);
//             else return Promise.reject("messenger not found");
//         }

//         return new Promise<QMessenger>((res, rej) => {
//             if ((<SessionIB>session).offersdp) {
//                 messenger.takeOffer(
//                     (<SessionIB>session).offersdp
//                 ).then(() => {
//                     res(messenger);
//                 }).catch(rej);
//             } else {
//                 messenger.makeOffer(
//                     // void
//                 ).then(offersdp => {
//                     // (<QMessengerImpl>messenger).peer.onopened = () => {
//                     //     res(messenger);
//                     // };
//                     // (<QMessengerImpl>messenger).peer.onclosed = () => {
//                     //     rej()
//                     // };
//                     signalx.send(signalx.offer(offersdp, user));
//                     res(messenger);
//                 }).catch(rej);
//             }
//         });
//     }

//     function remove(user: string): void {
//         if (!messengers[user]) return;

//         var peer = (<QMessengerImpl>messengers[user]).peer;
//         peer.destroy();
//         delete messengers[user];
//     }


//     export function sendmessage(user: string, msg: object): void {
//         get(
//             user, new TextSessionOB()
//         ).then(messenger => {
//             (<QMessengerImpl>messenger).peer.sendmessage(msg);
//         }).catch(err => {
//             console.error(err);
//         });
//     }

//     export var onmessage: (
//         user: string, msg: object
//     ) => void = () => { console.log("NOP!! QMessenger.onmessage"); };


//     export function makeCall(user: string, callman: CallManager): void {
//         get(
//             user
//         ).then(messenger => {
//             //
//         }).catch(err => {
//             console.error(err);
//         });
//     }

//     export var ringer: (user: string) => Promise<void>;
// }


// export namespace QMessenger {
//     export interface CallManager {
//         onringing(): void;
//         onaccepted(): void;
//         onrejected(): void;
//         onmissed(): void;

//         onhold(): void;
//         onunhold(): void;

//         hold(): void;
//         unhold(): void;
//         hangup(): void;

//         enableAudio(src?: string): void;
//         disableAudio(): void;
//         enableVideo(src?: string): void;
//         disableVideo(): void;
//     }

//     export interface CallObserver {
//         onringing: () => void;
//         onaccepted: () => void;
//         onrejected: () => void;
//         onmissed: () => void;

//         onhold: () => void;
//         onunhold: () => void;
//     }

//     class CallManagerImpl implements CallManager {
//         private _observer: CallObserver;
//         private _audiosender: RTCRtpSender | null = null;
//         private _videosender: RTCRtpSender | null = null;

//         private _peer: QPeer | null = null;

//         private _enableAudio: () => void = () => { };
//         private _enableVideo: () => void = () => { };

//         constructor(callobserver: CallObserver) {
//             this._observer = callobserver;
//         }

//         onringing(): void { this._observer.onringing(); }
//         onaccepted(): void { this._observer.onaccepted(); }
//         onrejected(): void { this._observer.onrejected(); }
//         onmissed(): void { this._observer.onmissed(); }

//         onhold(): void { this._observer.onhold(); }
//         onunhold(): void { this._observer.onunhold(); }

//         hold(): void { }
//         unhold(): void { }
//         hangup(): void { }

//         enableAudio(src?: string): void {
//             this._enableAudio = () => {
//                 navigator.mediaDevices.getUserMedia(
//                     { audio: true }
//                 ).then(stream => {
//                     stream.getTracks()[0];
//                 }).catch
//             };
//         }

//         disableAudio(): void {
//             if (this._peer) {
//                 //
//             } else this._enableAudio = () => { };
//         }

//         enableVideo(src?: string): void {
//             this._enableVideo = () => {
//                 navigator.mediaDevices.getUserMedia(
//                     { video: true }
//                 ).then(stream => {
//                     stream.getTracks()[0];
//                 }).catch
//             };
//         }

//         disableVideo(): void {
//             if (this._peer) {
//                 //
//             } else this._enableVideo = () => { };
//         }

//         init(peer: QPeer): void {
//             this._enableAudio();
//             this._enableVideo();
//             this._peer = peer;
//         }
//     }

//     export function CallManager(callobserver: CallObserver): CallManager {
//         return new CallManagerImpl(callobserver);
//     }
// }

// export { InvitationStage, InvitationError, JoinStage, JoinError } from "./peer";
