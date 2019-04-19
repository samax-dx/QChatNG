import { signalx } from '../signal';
import { QMessengerCore } from './QMessengerCore';
import { SessionOB, SessionIB } from './Session';


export class Registry {
    private _messengers: { [key: string]: QMessengerCore } = {};

    get(
        user: string, session?: SessionOB | SessionIB, negotiating = false
    ): Promise<QMessengerCore> {
        var messenger = this._messengers[user];

        if (session && negotiating) {
            if (!messenger) return Promise.reject("messenger not found");
        } else if (session) {
            if (messenger) return Promise.resolve(messenger);
            else messenger = this._messengers[user] = new QMessengerCore(user);
        } else {
            if (messenger) return Promise.resolve(messenger);
            else return Promise.reject("messenger not found");
        }

        return new Promise<QMessengerCore>((res, rej) => {
            if ((<SessionIB>session).offersdp) {
                messenger.takeOffer(
                    (<SessionIB>session).offersdp
                ).then(() => {
                    res(messenger);
                }).catch(rej);
            } else {
                messenger.makeOffer(
                    // void
                ).then(offersdp => {
                    // (<QMessengerImpl>messenger).peer.onopened = () => {
                    //     res(messenger);
                    // };
                    // (<QMessengerImpl>messenger).peer.onclosed = () => {
                    //     rej()
                    // };
                    signalx.send(signalx.offer(offersdp, user));
                    res(messenger);
                }).catch(rej);
            }
        });
    }
}
