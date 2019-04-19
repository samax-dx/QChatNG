import { signalx } from '../signalx';
import { UserKit } from './UserKit';


export const userkit = new class implements UserKit {
    private _init_ok = false;
    private _users: { [key: string]: 1 } = {};

    init(): void {
        if (this._init_ok) return;
        this._init_ok = true;

        signalx.onregisterevnt = event => {
            var user = event.data;
            if (event.type === "devicein") {
                if (this._users[user]) return;
                this._users[user] = 1;
                if (UserKit.onuserin) UserKit.onuserin(user);
            } else {
                delete this._users[user];
                if (UserKit.onuserout) UserKit.onuserout(user);
            }
        };
    }

    getUsers(): string[] { return Object.keys(this._users); }
}();
