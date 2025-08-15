import { NodeBufferProvider } from './buffer';

let execIdentifier = 0;

export const NodeBufferImplementation: NodeBufferProvider = {
    from: (data, encoding) => window.node.buffer.from(data, encoding),
}
