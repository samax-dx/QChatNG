import { qxpeer } from '../qchat/qpeer/qxpeer/util';


function OfferKit(offertype: "local" | "remote") {
    class SafeSDPHandler {
        private _offersdp: RTCSessionDescriptionInit | null = null;
        private _onofferset: () => void = () => { };

        protected setsdp(
            peer: RTCPeerConnection,
            sdp: RTCSessionDescriptionInit,
            sdpsource = offertype
        ): Promise<void> {
            return new Promise<void>((res, rej) => {
                var onset = (x?: any) => { this._onofferset(); };
                var res_ = () => { onset(res()); };

                if (sdpsource === "local") {
                    peer.setLocalDescription(sdp).then(res_).catch(rej);
                } else peer.setRemoteDescription(sdp).then(res_).catch(rej);
            });
        }

        trysetoffer(
            peer: RTCPeerConnection,
            offersdp: RTCSessionDescriptionInit,
            onset: () => void
        ): Promise<void> {
            this._offersdp = offersdp;
            this._onofferset = onset ? onset : this._onofferset;

            if (qxpeer.sdprollback) return this.setsdp(peer, offersdp);
            else return Promise.resolve();
        }

        setoffer(peer: RTCPeerConnection): Promise<void> {
            var offersdp = this._offersdp;
            this._offersdp = null;

            if (qxpeer.sdprollback) return Promise.resolve();
            else return this.setsdp(peer, offersdp);
        }
    }
    return SafeSDPHandler;
}


export const OfferKitLocal = OfferKit("local");
export const OfferKitRemote = OfferKit("remote");
