import { SessionIB, SessionOB } from './Session';
import { UserKit } from '../userkit/UserKit';
import { QPeerImpl } from './qpeer/QPeerImpl';
import { QPeer } from './qpeer/QPeer';


export class PeerRegistry {
    private _peers: { [key: string]: QPeer } = {};

    // /** basic */
    // getPeer(user: string): Promise<QPeer>;

    // /** for creating. returns previous messenger if exists. */
    // getPeer(
    //     user: string, session: SessionOB | SessionIB
    // ): Promise<QPeer>;

    // /** for negotiating */
    // getPeer(
    //     user: string, session: SessionOB | SessionIB, negotiating?: boolean
    // ): Promise<QPeer>;

    // getPeer(
    //     user: string, session?: SessionOB | SessionIB, negotiating = false
    // ): Promise<QPeer> {
    //     var peer = this._peers[user];

    //     if (session && negotiating) {
    //         if (!peer) return Promise.reject("messenger not found");
    //     } else if (session) {
    //         var localuser = UserKit.localuser;
    //         if (peer) return Promise.resolve(peer);
    //         else peer = this._peers[user] = new QPeerImpl(localuser, user);
    //     } else {
    //         if (peer) return Promise.resolve(peer);
    //         else return Promise.reject("messenger not found");
    //     }

    //     var setuppeer = session && session.onbeforestart
    //         ? session.onbeforestart
    //         : () => { };

    //     return new Promise<QPeer>((res, rej) => {
    //         if ((<SessionIB>session).offersdp) {
    //             peer.takeOffer(
    //                 (<SessionIB>session).offersdp
    //             ).then(() => {
    //                 setuppeer(peer);
    //                 setTimeout(() => { res(peer); }, 0);
    //             }).catch(rej);
    //         } else {
    //             setuppeer(peer);
    //             setTimeout(() => {
    //                 peer.makeOffer(
    //                     (<SessionOB>session).offertype
    //                 ).then(() => {
    //                     res(peer);
    //                 }).catch(rej);
    //             }, 0);
    //         }
    //     });
    // }

    get(user: string): QPeer | null {
        var peer = this._peers[user];
        return peer ? peer : null;
    }

    createpeer(user: string): QPeer {
        var peers = this._peers;
        return peers[user] = new class extends QPeerImpl {
            destroy(reason: any): void {
                delete peers[user];
                super.destroy(reason);
            }
        }(UserKit.localuser, user);
    }

    private static _registry: PeerRegistry | null = null;
    static create(): PeerRegistry {
        if (PeerRegistry._registry) return PeerRegistry._registry;
        else return PeerRegistry._registry = new PeerRegistry();
    }
}
