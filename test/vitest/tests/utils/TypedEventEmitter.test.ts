import { expect, describe, beforeEach, it } from "vitest";
import { TypedEventEmitter, TypedListener } from "../../../../src/utils/TypedEventEmitter";

describe("TypedEventEmitter", () => {
    interface TestEvent {
        message: string;
    }

    const createTestListener = (receivedEvents: TestEvent[]): TypedListener<TestEvent> => {
        return async (event: TestEvent) => {
            receivedEvents.push(event);
        };
    };

    let eventEmitter: TypedEventEmitter<TestEvent>;

    beforeEach(() => {
        eventEmitter = new TypedEventEmitter<TestEvent>();
    });

    it("should emit events to active listeners", async () => {
        const receivedEvents1: TestEvent[] = [];
        const receivedEvents2: TestEvent[] = [];

        const listener1 = createTestListener(receivedEvents1);
        const listener2 = createTestListener(receivedEvents2);

        eventEmitter.addListener(listener1);
        eventEmitter.addListener(listener2);

        const testEvent: TestEvent = { message: "Hello, World!" };
        await eventEmitter.emit(testEvent);

        expect(receivedEvents1).toEqual([testEvent]);
        expect(receivedEvents2).toEqual([testEvent]);

        eventEmitter.removeListener(listener1);

        const testEvent2: TestEvent = { message: "Hello again, World!" };
        await eventEmitter.emit(testEvent2);

        expect(receivedEvents1).toEqual([testEvent]);
        expect(receivedEvents2).toEqual([testEvent, testEvent2]);
    });

    it("should handle empty listeners", async () => {
        await expect(eventEmitter.emit({ message: "Test" })).resolves.not.toThrow();
    });
});
