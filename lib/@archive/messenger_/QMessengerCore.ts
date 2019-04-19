import { IQMessengerCore } from './IQMessengerCore';
import { QPeer } from '../qpeer';


export class QMessengerCore implements IQMessengerCore {
    peer: QPeer;

    constructor(user: string) {
        this.peer = QPeer(user);
        this.peer.onmessage = msg => { IQMessengerCore.onmessage(user, msg); };
    }

    makeOffer(): Promise<RTCSessionDescriptionInit> {
        return this.peer.makeOffer();
    }

    setAnswer(answersdp: RTCSessionDescriptionInit): Promise<void> {
        return this.peer.setAnswer(answersdp);
    }

    takeOffer(offersdp: RTCSessionDescriptionInit): Promise<void> {
        return this.peer.takeOffer(offersdp);
    }

    doAnswer(): Promise<RTCSessionDescriptionInit> {
        return this.peer.doAnswer();
    }

    cancelOffer(): Promise<void> {
        return this.peer.cancelOffer();
    }

    addIce(ice: RTCIceCandidate): Promise<void> {
        return this.peer.addIce(ice);
    }

    sendMessage(msg: object): void {
        this.peer.sendmessage(msg);
    }
}
