export default class StateTracker {

    private readonly _currentState: Map<string, string>;

    get currentState(): Map<string, string> {
        return this._currentState;
    }

    constructor(currentState: Map<string, string>) {
        this._currentState = currentState;
    }
}
