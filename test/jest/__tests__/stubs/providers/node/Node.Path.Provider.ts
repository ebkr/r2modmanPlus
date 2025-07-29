import {NodePathProvider} from "../../../../../../src/providers/node/path/path";
import path from "node:path";

export const TestPathProvider = {
    join: (...paths: string[]) => path.join(...paths),
    dirname: (pathName: string) => path.dirname(pathName),
    extname: (pathName: string) => path.extname(pathName),
    basename: (pathName: string) => path.basename(pathName),
    relative: (pathOne: string, pathTwo: string) => path.relative(pathOne, pathTwo),
    resolve: (...paths: string[]) => path.resolve(...paths),
} as NodePathProvider;
