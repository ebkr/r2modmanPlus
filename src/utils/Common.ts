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

export const sleep = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));
