import { QxPeer } from './QxPeer';
import { qxpeer } from './util';


export interface QxPeerStateGuard { }

export function QxPeerStateGuard(
    Base: new (luser: string, ruser: string) => QxPeer
) {
    return class extends Base implements QxPeerStateGuard {
        configureToMakeOffer(): Promise<void> {
            if (qxpeer.canOffer(this.peerconn())) {
                return super.configureToMakeOffer();
            } else return Promise.reject("QPeer can't make Offerer");
        }

        setRemoteAnswer(answersdp: RTCSessionDescriptionInit): Promise<void> {
            if (qxpeer.canSetAnswer(this.peerconn())) {
                return super.setRemoteAnswer(answersdp);
            } else return Promise.reject("QPeer can't set remote answer");
        }

        configureToTakeOffer(): Promise<void> {
            if (qxpeer.canTakeOffer(this.peerconn())) {
                return super.configureToTakeOffer();
            } else return Promise.reject("QPeer can't take Offer");
        }

        setLocalAnswer(answersdp: RTCSessionDescriptionInit): Promise<void> {
            if (qxpeer.canAnswer(this.peerconn())) {
                return super.setLocalAnswer(answersdp);
            } else return Promise.reject("QPeer can't set local answer");
        }

        rollback(): Promise<void> {
            var peer = this.peerconn();

            if (peer.signalingState === "stable") return Promise.resolve();

            if (peer.signalingState === "have-local-offer" ||
                peer.signalingState === "have-remote-offer") {
                return super.rollback();
            } else Promise.reject("QxPeer state invalid");
        }
    };
}
