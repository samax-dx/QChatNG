import { QxPeer } from './QxPeer';


export interface QxPeerRemoteICEHandler { }

export function QxPeerRemoteICEHandler(
    Base: new (luser: string, ruser: string) => QxPeer
) {
    return class extends Base implements QxPeerRemoteICEHandler {
        private _answer_ices: RTCIceCandidate[] | null = null;
        private _offer_ices: RTCIceCandidate[] | null = null;

        configureToMakeOffer(): Promise<void> {
            this._answer_ices = [];
            this._offer_ices = null;
            return super.configureToMakeOffer();
        }

        configureToTakeOffer(): Promise<void> {
            this._answer_ices = null;
            this._offer_ices = [];
            return super.configureToTakeOffer();
        }

        setRemoteOffer(offersdp: RTCSessionDescriptionInit): Promise<void> {
            return new Promise<void>((res, rej) => {
                super.setRemoteOffer(
                    offersdp
                ).then(() => {
                    //setTimeout(() => {
                    var ices = this._offer_ices;
                    this._offer_ices = null;
                    if (ices) this.addIces(ices);
                    //}, 0);
                    res();
                }).catch(rej);
            });
        }

        setRemoteAnswer(answersdp: RTCSessionDescriptionInit): Promise<void> {
            return new Promise<void>((res, rej) => {
                super.setRemoteAnswer(
                    answersdp
                ).then(() => {
                    //setTimeout(() => {
                    var ices = this._answer_ices;
                    this._answer_ices = null;
                    if (ices) this.addIces(ices);
                    //}, 0);
                    res();
                }).catch(rej);
            });
        }

        // setRemoteAnswer(answersdp: RTCSessionDescriptionInit): Promise<void> {
        //     return new Promise<void>((res, rej) => {
        //         super.setRemoteAnswer(
        //             answersdp
        //         ).then(() => {
        //             setTimeout(() => {
        //                 var ices = this._answer_ices;
        //                 this._answer_ices = null;
        //                 if (ices) this.addIces(ices);
        //             }, 0);
        //             res();
        //         }).catch(rej);
        //     });
        // }

        // setLocalAnswer(answersdp: RTCSessionDescriptionInit): Promise<void> {
        //     return new Promise<void>((res, rej) => {
        //         super.setLocalAnswer(
        //             answersdp
        //         ).then(() => {
        //             setTimeout(() => {
        //                 var ices = this._offer_ices;
        //                 this._offer_ices = null;
        //                 if (ices) this.addIces(ices);
        //             }, 0);
        //             res();
        //         }).catch(rej);
        //     });
        // }

        addIce(ice: RTCIceCandidate): Promise<void> {
            if (this._answer_ices) this._answer_ices.push(ice);
            else if (this._offer_ices) this._offer_ices.push(ice);
            else return super.addIce(ice);
            // console.log("ice cached");
            return Promise.resolve();
        }

        addIces(ices: RTCIceCandidate[]): void {
            ices.forEach(ice => {
                super.addIce(
                    ice
                ).then(() => {
                    // console.log("flushed ice");
                }).catch(err => {
                    console.log(err);
                });
            });
        }

        rollback(): Promise<void> {
            this._answer_ices = null;
            this._offer_ices = null;
            return super.rollback();
        }
    }
}
