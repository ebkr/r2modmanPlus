type Mappable = {
  [key: string]: any;
};

export const getPropertyFromPath = (object: Mappable, path: string | string[]): any => {
    if (!object) {
    	return undefined;
    }
    if (typeof path === 'string') {
  	    const parts = path.split('.');
        for (let i = 0; i < parts.length; i++) {
            if (!object) {
                return undefined;
            }
            const key = parts[i];
            object = object[key];
        }
        return object;
    }
    for (let i = 0; i < path.length; i++) {
        const res = getPropertyFromPath(object, path[i]);
        if (res) {
            return res;
        }
    }
    return undefined;
};

export async function retry<T>(
    fn: () => Promise<T>,
    attempts: number = 3,
    canRetry: () => boolean = () => true,
    onError: (e: Error | unknown) => void = console.error
): Promise<T> {
    for (let currentAttempt = 1; currentAttempt <= attempts; currentAttempt++) {
        if (!canRetry()) {
            throw new Error("Retry interrupted");
        }

        try {
            return await fn();
        } catch (e) {
            onError(e);

            if (currentAttempt < attempts) {
                await sleep(5000);
            }
        }
    }
    throw new Error(`Retry failed after ${attempts} attempts!`);
}

export const sleep = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));
