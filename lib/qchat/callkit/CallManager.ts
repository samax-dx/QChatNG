export interface CallManager {
    /** can be used as canceler */
    hangup(): void;

    hold(): void;
    unhold(): void;
}
