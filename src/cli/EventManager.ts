export class EventManager<T> {

    private readonly _subscribers: EventSubscription<T>[] = [];

    public subscribe(subscriber: (e: T) => void): EventSubscription<T> {
        const subscription = new EventSubscription(subscriber);
        this._subscribers.push(subscription);
        return subscription;
    }

    public publish(event: T) {
        this._subscribers.forEach(async subscriber => {
            subscriber.do(event);
        })
    }
}

class EventSubscription<T> {

    private _isActive: boolean = true;
    private readonly _action: (e: T) => void;

    constructor(action: (e: T) => void) {
        this._action = action;
    }

    public unsubscribe() {
        this._isActive = false;
    }

    public do(event: T) {
        if (this._isActive) {
            this._action(event);
        }
    }

}

export const EventSubscriptionType = typeof EventSubscription;
