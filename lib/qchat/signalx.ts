import { $L } from './util/stringliteral';


const XRegisterEventType = {
    DEVICEIN: $L("devicein"),
    DEVICEOUT: $L("deviceout")
};
export type XRegisterEventType =
    (typeof XRegisterEventType)[keyof typeof XRegisterEventType];

const XConnectEventType = {
    OFFER: $L("offer"),
    ANSWER: $L("answer"),
    CANDIDATE: $L("candidate")
};
type XConnectEventType =
    (typeof XConnectEventType)[keyof typeof XConnectEventType];

const XDataEventType = {
    MESSAGE: $L("message")
};
type XDataEventType =
    (typeof XDataEventType)[keyof typeof XDataEventType];

const XCallEventType = {
    DIAL: $L("dial"),
    DIAL_RV: $L("dial_rv"),
    ACKDIAL: $L("ackdial"),
    ACCEPT: $L("accept"),
    ACKACCEPT: $L("ackaccept"),
    REJECT: $L("reject"),
    ACKREJECT: $L("ackreject"),
    CANCEL: $L("cancel"),
    ACKCANCEL: $L("ackcancel"),
    HOLD: $L("hold"),
    UNHOLD: $L("unhold"),
    HANGUP: $L("hangup")
};
type XCallEventType =
    (typeof XCallEventType)[keyof typeof XCallEventType];


export interface XRegisterEvent { type: XRegisterEventType; data: any; }
export namespace XRegisterEvent {
    export const Type = XRegisterEventType;
    export type Type = XRegisterEventType;
}


export interface XChannelEvent {
    type: XConnectEventType | XDataEventType | XCallEventType;
    data: any;
    ruser: string
}

export namespace XChannelEvent {
    export const Type = Object.assign(
        {}, XConnectEventType, XDataEventType, XCallEventType
    );
    export type Type = XConnectEventType | XDataEventType | XCallEventType;
}


export interface XConnectEvent extends XChannelEvent { }
export namespace XConnectEvent {
    export const Type = XConnectEventType;
    export type Type = XConnectEventType;
}


export interface XDataEvent extends XChannelEvent { }
export namespace XDataEvent {
    export const Type = XDataEventType;
    export type Type = XDataEventType;
}


export interface XCallEvent extends XChannelEvent { }
export namespace XCallEvent {
    export const Type = XCallEventType;
    export type Type = XCallEventType;
}


export namespace signalx {
    export declare var socket: WebSocket;

    var init_ok = false;
    export function init(): void {
        if (init_ok) return;
        if (!socket) return;
        init_ok = true;

        socket.onmessage = event => {
            parse(
                event.data,
                onregisterevnt,
                onconnectevent,
                ondataevent,
                oncallevent,
                oninvalidevent
            );
        };
    }

    function create(
        type: XRegisterEvent.Type | XChannelEvent.Type,
        data: any,
        ruser?: string
    ): XRegisterEvent | XChannelEvent {
        if (type === "devicein" || type === "deviceout")
            return { type: type, data: data };

        return { type: type, data: data, ruser: ruser };
    }

    function parse(
        jsonMsg: string,
        onRegisterEvent: (event: XRegisterEvent) => void,
        onConnectEvent: (event: XConnectEvent) => void,
        onDataEvent: (event: XDataEvent) => void,
        onCallEvent: (event: XCallEvent) => void,
        onInvalidEvent: (jsonMsg: string) => void = () => {
            console.warn("NOP!! signalx.parse > onInvalidEvent");
        }
    ): void {
        var event = <{ [key: string]: any }>JSON.parse(jsonMsg);
        if (event === undefined || typeof event !== "object")
            return onInvalidEvent(jsonMsg);
        //console.log(event); ////////////////////////////////////////////////////

        var et: XRegisterEvent.Type | XChannelEvent.Type = event["type"];
        if (typeof et !== "string") return onInvalidEvent(jsonMsg);

        for (var key in XRegisterEvent.Type)
            if (XRegisterEvent.Type[key] === et)
                return onRegisterEvent(<XRegisterEvent>event);

        var ruser: string = event["ruser"];
        if (typeof ruser !== "string") return onInvalidEvent(jsonMsg);

        for (var key in XConnectEvent.Type)
            if (XConnectEvent.Type[key] === et)
                return onConnectEvent(<XChannelEvent>event);

        for (var key in XDataEvent.Type)
            if (XDataEvent.Type[key] === et)
                return onDataEvent(<XChannelEvent>event);

        for (var key in XCallEvent.Type)
            if (XCallEvent.Type[key] === et)
                return onCallEvent(<XChannelEvent>event);

        return onInvalidEvent(jsonMsg);
    }

    export function send(
        type: XChannelEvent.Type, data: any, ruser?: string
    ): void {
        var event = create(type, data, ruser);
        //console.log(event); ////////////////////////////////////////////////////
        socket.send(JSON.stringify(event));
    }

    export declare var oninvalidevent: (event: string) => void;
    export declare var oncallevent: (event: XCallEvent) => void;
    export declare var ondataevent: (event: XDataEvent) => void;
    export declare var onconnectevent: (event: XConnectEvent) => void;
    export declare var onregisterevnt: (event: XRegisterEvent) => void;
}
