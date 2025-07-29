import {NodePathProvider} from "../../../../../../src/providers/node/path/path";
import path from "path";

export const TestPathProvider = {
    join: (...paths: string[]) => path.join(...paths),
    dirname: (path: string) => path.dirname(path),
    extname: (path: string) => path.extname(path),
    basename: (path: string) => path.basename(path),
    relative: (pathOne: string, pathTwo: string) => path.relative(pathOne, pathTwo),
    resolve: (...paths: string[]) => path.resolve(...paths),
} as NodePathProvider;
