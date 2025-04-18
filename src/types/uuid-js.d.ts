declare module 'uuid-js' {
    class UUID {
        static create(): UUID;
        toString(): string;
    }
    export = UUID;
}
