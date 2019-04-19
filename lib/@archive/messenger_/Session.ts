export interface SessionOB { }
export interface SessionIB { offersdp: RTCSessionDescriptionInit; }

export class TextSessionOB implements SessionOB { }
export class CallSessionOB implements SessionOB {
    constructor(public enableVideo: boolean = false) { }
}

export class TextSessionIB implements SessionIB {
    constructor(public offersdp: RTCSessionDescriptionInit) { }
}
export class CallSessionIB implements SessionIB {
    constructor(
        public offersdp: RTCSessionDescriptionInit,
        public enableVideo: boolean = false
    ) { }
}
