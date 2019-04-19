export interface CallObserver {
    onringing?: () => void;

    onhold: () => void;
    onunhold: () => void;

    onstart: () => void;
    onhangup: (reason: any) => void;

    onlocalmediastream: (stream: MediaStream) => void;
    onremotemediastream: (stream: MediaStream) => void;
}
