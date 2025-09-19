import { NodeBufferImplementation } from './BufferImplementation';

export type NodeBufferProvider = {
    from: (data: any, encoding?: 'utf8' | 'base64') => Buffer;
}

let implementation: () => NodeBufferProvider;

function getImplementation(): NodeBufferProvider {
    if (!implementation) {
        return NodeBufferImplementation;
    }
    return implementation();
}

export function provideBufferImplementation(provider: () => NodeBufferProvider) {
    implementation = provider;
}

const buffer: NodeBufferProvider = {
    from: (...args) => getImplementation().from(...args),
};

export default buffer;
