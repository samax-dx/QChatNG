import { IQMessenger } from './IQMessenger';
import { QPeer } from '../qpeer';

export interface IQMessengerCore extends IQMessenger {
    peer: QPeer;
}

export namespace IQMessengerCore {
    export declare function onmessage(user: string, msg: object): void;
}
