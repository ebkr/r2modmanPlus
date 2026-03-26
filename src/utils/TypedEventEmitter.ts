export type TypedListener<Event> = (e: Event) => Promise<void>;
export interface ITypedEventEmitter<Event> {
    addListener(listener: TypedListener<Event>): void;
    removeListener(listener: TypedListener<Event>): void;
    emit(event: Event): Promise<void>;
}


export class TypedEventEmitter<T> implements ITypedEventEmitter<T> {
    private readonly listeners: Set<TypedListener<T>>;

    constructor() {
        this.listeners = new Set();
    }

    public addListener(listener: TypedListener<T>): void {
        this.listeners.add(listener);
    }

    public removeListener(listener: TypedListener<T>): void {
        this.listeners.delete(listener);
    }

    public async emit(event: T): Promise<void> {
        const listenerPromises = Array.from(this.listeners).map(listener => listener(event));
        await Promise.all(listenerPromises);
    }
}
