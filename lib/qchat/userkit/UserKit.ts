export interface UserKit {
    init(): void;
    getUsers(): string[];
}

export namespace UserKit {
    export declare var localuser: string;
    export declare var onuserin: (user: string) => void;
    export declare var onuserout: (user: string) => void;
}
