import { QPeer } from './qpeer/QPeer';
import { XChannelEvent } from '../signalx';

interface Session {
    onbeforestart?: (peer: QPeer) => void;
}

export interface SessionOB extends Session { offertype: XChannelEvent.Type; }

export interface SessionIB extends Session {
    offersdp: RTCSessionDescriptionInit;
}
