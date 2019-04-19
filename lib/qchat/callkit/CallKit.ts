import { CallObserver } from './CallObserver';
import { CallManager } from './CallManager';


export interface CallKit {
    init(): void;

    makeCall(
        user: string, requestvideo: boolean, callobserver: CallObserver
    ): Promise<CallManager>;

    takeCall(
        user: string, videorequested: boolean, callobserver: CallObserver
    ): Promise<CallManager>;
}

export namespace CallKit {
    export declare var oncall: (
        user: string,
        videorequested: boolean,
        onaccept: () => void,
        onreject: () => void
    ) => (ok: boolean) => void;
}
