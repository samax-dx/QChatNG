export interface IMKit {
    sendMessage(msg: {}): void; // adddatachannel?
    onmessage: (msg: {}) => void;
}
