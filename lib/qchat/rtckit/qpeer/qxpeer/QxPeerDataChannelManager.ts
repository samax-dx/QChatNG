import { QxPeer } from './QxPeer';
import { qxpeer } from './util';


export interface QxPeerDataChannelManager {
    sendmessagealt: (msg: object) => void;
}

export function QxPeerDataChannelManager(
    Base: new (luser: string, ruser: string) => QxPeer
) {
    return class extends Base implements QxPeerDataChannelManager {
        private _datach: RTCDataChannel | null = null;
        private _datachisnew: boolean = true;
        private _msgequeue: object[] = [];

        constructor(luser: string, ruser: string) {
            super(luser, ruser);

            this.peerconn().ondatachannel = event => {
                this.setupdc(event.channel);
            };
        }

        configureToMakeOffer(): Promise<void> {
            if (!qxpeer.datachannel || this._datach)
                return super.configureToMakeOffer();

            return new Promise<void>((res, rej) => {
                var user = this.remoteuser();
                this.setupdc(this.peerconn().createDataChannel(user));

                setTimeout(() => { // buy time for negotiation
                    super.configureToMakeOffer().then(res).catch(rej);
                }, 0);
            });
        }

        sendMessage(msg?: object): void {
            if (msg) this._msgequeue.push(msg);

            if (qxpeer.datachannel) {
                if (!this._datach || this._datach.readyState !== "open")
                    return;
                while (this._msgequeue.length)
                    this._datach.send(JSON.stringify(this._msgequeue.pop()));
            } else {
                while (this._msgequeue.length)
                    this.sendmessagealt(this._msgequeue.pop());
            }
        }

        sendmessagealt: (msg: object) => void;;

        rollback(): Promise<void> {
            if (this._datach && this._datachisnew) {
                this._datach.close();
                this._datach = null;
            }
            return super.rollback();
        }

        destroy(): void {
            if (this._datach) this._datach.close();
            this._datach = null;
            super.destroy();
        }

        private setupdc(channel: RTCDataChannel): void {
            var dc = this._datach = channel;
            dc.onopen = () => {
                this._datachisnew = false;
                this.sendMessage();
            };
            dc.onclose = event => { console.log(event); }
            dc.onerror = event => { console.log(event.error); };
            dc.onmessage = event => { this.onmessage(JSON.parse(event.data)); };
        }
    };
}
