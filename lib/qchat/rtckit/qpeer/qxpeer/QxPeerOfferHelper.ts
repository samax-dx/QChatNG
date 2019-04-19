import { QxPeer } from './QxPeer';
import { qxpeer } from './util';


export interface QxPeerOfferHelper {
    setLocalOffer(offersdp?: RTCSessionDescriptionInit): Promise<void>;
    setRemoteOffer(offersdp?: RTCSessionDescriptionInit): Promise<void>;
}

export function QxPeerOfferHelper(
    Base: new (luser: string, ruser: string) => QxPeer
) {
    return class extends Base implements QxPeerOfferHelper {
        private _localoffer: RTCSessionDescriptionInit | null = null;
        private _remoteoffer: RTCSessionDescriptionInit | null = null;

        setLocalOffer(offersdp?: RTCSessionDescriptionInit): Promise<void> {
            if (qxpeer.sdprollback) {
                if (offersdp) return super.setLocalOffer(offersdp);
                else return Promise.resolve();
            }

            if (offersdp) {
                this._localoffer = offersdp;
                return Promise.resolve();
            } else {
                var offer = this._localoffer;
                this._localoffer = null;
                return super.setLocalOffer(offer);
            }
        }

        setRemoteOffer(offersdp?: RTCSessionDescriptionInit): Promise<void> {
            if (qxpeer.sdprollback) {
                if (offersdp) return super.setRemoteOffer(offersdp);
                else return Promise.resolve();
            }

            if (offersdp) {
                this._remoteoffer = offersdp;
                return Promise.resolve();
            } else {
                var offer = this._remoteoffer;
                this._remoteoffer = null;
                return super.setRemoteOffer(offer);
            }
        }
    };
}
