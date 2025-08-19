import { NodeOsProvider } from "./os";

export const NodeOsImplementation: NodeOsProvider = {
    homedir: () => window.node.os.homedir(),
}
