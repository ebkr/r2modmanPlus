import { NodeBufferProvider } from './buffer';

export const NodeBufferImplementation: NodeBufferProvider = {
    from: (data, encoding) => window.node.buffer.from(data, encoding),
}
