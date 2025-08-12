import FsProvider from '../../../../../src/providers/generic/file/FsProvider';
import Dexie from 'dexie';
import { types } from 'sass';
import * as Buffer from 'buffer';
import Error = types.Error;
import Promise = Dexie.Promise;

export default class StubFsProvider extends FsProvider {

    base64FromZip = async (path: string) => {
        throw new Error("Stub access must be mocked or spied");
    };

    chmod = async (path: string, mode: string | number) => {
        throw new Error("Stub access must be mocked or spied");
    };

    copyFile = async (from: string, to: string) => {
        throw new Error("Stub access must be mocked or spied");
    };

    copyFolder = async (from: string, to: string) => {
        throw new Error("Stub access must be mocked or spied");
    };

    exists = async (path: string) => {
        throw new Error("Stub access must be mocked or spied");
    };

    lstat = async (path: string) => {
        throw new Error("Stub access must be mocked or spied");
    };

    mkdirs = async (path: string) => {
        throw new Error("Stub access must be mocked or spied");
    };

    readFile = async (path: string) => {
        throw new Error("Stub access must be mocked or spied");
    };

    readdir = async (path: string) => {
        throw new Error("Stub access must be mocked or spied");
    };

    realpath = async (path: string) => {
        throw new Error("Stub access must be mocked or spied");
    };

    rename = async (path: string, newPath: string) => {
        throw new Error("Stub access must be mocked or spied");
    };

    rmdir = async (path: string) => {
        throw new Error("Stub access must be mocked or spied");
    };

    stat = async (path: string) => {
        throw new Error("Stub access must be mocked or spied");
    };

    unlink = async (path: string) => {
        throw new Error("Stub access must be mocked or spied");
    };

    writeFile = async (path: string, content: string | Buffer) => {
        throw new Error("Stub access must be mocked or spied");
    };

    writeStreamToFile = async (path: string, content: ReadableStream) => {
        throw new Error("Stub access must be mocked or spied");
    }

    setModifiedTime = async (path: string, time: Date) => {
        throw new Error("Stub access must be mocked or spied");
    };
}
