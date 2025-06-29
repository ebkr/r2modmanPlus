/**
 * This file is automatically generated by the sync.ts script.
 * Do not edit it manually.
 */

export interface ThunderstoreEcosystem {
    communities:       { [key: string]: ThunderstoreEcosyste };
    games:             { [key: string]: Game };
    modloaderPackages: ModloaderPackage[];
    packageInstallers: { [key: string]: PackageInstaller };
    schemaVersion:     string;
}

export interface ThunderstoreEcosyste {
    autolistPackageIds?: string[];
    categories:          { [key: string]: Category };
    discordUrl?:         string;
    displayName:         string;
    sections:            { [key: string]: Section };
    shortDescription?:   string;
    wikiUrl?:            string;
}

export interface Category {
    label: string;
}

export interface Section {
    excludeCategories?: string[];
    name:               string;
    requireCategories?: string[];
}

export interface Game {
    distributions: Distribution[];
    label:         string;
    meta:          Meta;
    r2modman:      R2Modman[] | null;
    tcli?:         { [key: string]: any };
    thunderstore?: ThunderstoreEcosyste;
    uuid:          string;
}

export interface Distribution {
    identifier?: any;
    platform:    Platform;
}

export enum Platform {
    EPIC_GAMES_STORE = "epic-games-store",
    OCULUS_STORE = "oculus-store",
    ORIGIN = "origin",
    OTHER = "other",
    STEAM = "steam",
    STEAM_DIRECT = "steam-direct",
    XBOX_GAME_PASS = "xbox-game-pass",
}

export interface Meta {
    displayName: string;
    iconUrl:     null | string;
}

export interface R2Modman {
    additionalSearchStrings:  string[];
    dataFolderName:           string;
    distributions:            Distribution[];
    exeNames:                 string[];
    gameInstanceType:         GameInstanceType;
    gameSelectionDisplayMode: GameSelectionDisplayMode;
    installRules:             InstallRule[];
    internalFolderName:       string;
    meta:                     Meta;
    packageIndex:             string;
    packageLoader:            Loader;
    relativeFileExclusions:   string[] | null;
    settingsIdentifier:       string;
    steamFolderName:          string;
}

export enum GameInstanceType {
    GAME = "game",
    SERVER = "server",
}

export enum GameSelectionDisplayMode {
    HIDDEN = "hidden",
    VISIBLE = "visible",
}

export interface InstallRule {
    defaultFileExtensions: string[];
    isDefaultLocation:     boolean;
    route:                 string;
    subRoutes:             InstallRule[];
    trackingMethod:        TrackingMethod;
}

export enum TrackingMethod {
    NONE = "none",
    PACKAGE_ZIP = "package-zip",
    STATE = "state",
    SUBDIR = "subdir",
    SUBDIR_NO_FLATTEN = "subdir-no-flatten",
}

export enum Loader {
    BEPINEX = "bepinex",
    GDWEAVE = "gdweave",
    GODOTML = "godotml",
    LOVELY = "lovely",
    MELONLOADER = "melonloader",
    NONE = "none",
    NORTHSTAR = "northstar",
    RECURSIVE_MELONLOADER = "recursive-melonloader",
    RETURN_OF_MODDING = "return-of-modding",
    SHIMLOADER = "shimloader",
}

export interface ModloaderPackage {
    loader:     Loader;
    packageId:  string;
    rootFolder: string;
}

export interface PackageInstaller {
    description: string;
    name:        string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toThunderstoreEcosystem(json: string): ThunderstoreEcosystem {
        return cast(JSON.parse(json), r("ThunderstoreEcosystem"));
    }

    public static thunderstoreEcosystemToJson(value: ThunderstoreEcosystem): string {
        return JSON.stringify(uncast(value, r("ThunderstoreEcosystem")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "ThunderstoreEcosystem": o([
        { json: "communities", js: "communities", typ: m(r("ThunderstoreEcosyste")) },
        { json: "games", js: "games", typ: m(r("Game")) },
        { json: "modloaderPackages", js: "modloaderPackages", typ: a(r("ModloaderPackage")) },
        { json: "packageInstallers", js: "packageInstallers", typ: m(r("PackageInstaller")) },
        { json: "schemaVersion", js: "schemaVersion", typ: "" },
    ], false),
    "ThunderstoreEcosyste": o([
        { json: "autolistPackageIds", js: "autolistPackageIds", typ: u(undefined, a("")) },
        { json: "categories", js: "categories", typ: m(r("Category")) },
        { json: "discordUrl", js: "discordUrl", typ: u(undefined, "") },
        { json: "displayName", js: "displayName", typ: "" },
        { json: "sections", js: "sections", typ: m(r("Section")) },
        { json: "shortDescription", js: "shortDescription", typ: u(undefined, "") },
        { json: "wikiUrl", js: "wikiUrl", typ: u(undefined, "") },
    ], false),
    "Category": o([
        { json: "label", js: "label", typ: "" },
    ], false),
    "Section": o([
        { json: "excludeCategories", js: "excludeCategories", typ: u(undefined, a("")) },
        { json: "name", js: "name", typ: "" },
        { json: "requireCategories", js: "requireCategories", typ: u(undefined, a("")) },
    ], false),
    "Game": o([
        { json: "distributions", js: "distributions", typ: a(r("Distribution")) },
        { json: "label", js: "label", typ: "" },
        { json: "meta", js: "meta", typ: r("Meta") },
        { json: "r2modman", js: "r2modman", typ: u(a(r("R2Modman")), null) },
        { json: "tcli", js: "tcli", typ: u(undefined, m("any")) },
        { json: "thunderstore", js: "thunderstore", typ: u(undefined, r("ThunderstoreEcosyste")) },
        { json: "uuid", js: "uuid", typ: "" },
    ], false),
    "Distribution": o([
        { json: "identifier", js: "identifier", typ: u(undefined, "any") },
        { json: "platform", js: "platform", typ: r("Platform") },
    ], false),
    "Meta": o([
        { json: "displayName", js: "displayName", typ: "" },
        { json: "iconUrl", js: "iconUrl", typ: u(null, "") },
    ], false),
    "R2Modman": o([
        { json: "additionalSearchStrings", js: "additionalSearchStrings", typ: a("") },
        { json: "dataFolderName", js: "dataFolderName", typ: "" },
        { json: "distributions", js: "distributions", typ: a(r("Distribution")) },
        { json: "exeNames", js: "exeNames", typ: a("") },
        { json: "gameInstanceType", js: "gameInstanceType", typ: r("GameInstanceType") },
        { json: "gameSelectionDisplayMode", js: "gameSelectionDisplayMode", typ: r("GameSelectionDisplayMode") },
        { json: "installRules", js: "installRules", typ: a(r("InstallRule")) },
        { json: "internalFolderName", js: "internalFolderName", typ: "" },
        { json: "meta", js: "meta", typ: r("Meta") },
        { json: "packageIndex", js: "packageIndex", typ: "" },
        { json: "packageLoader", js: "packageLoader", typ: r("Loader") },
        { json: "relativeFileExclusions", js: "relativeFileExclusions", typ: u(a(""), null) },
        { json: "settingsIdentifier", js: "settingsIdentifier", typ: "" },
        { json: "steamFolderName", js: "steamFolderName", typ: "" },
    ], false),
    "InstallRule": o([
        { json: "defaultFileExtensions", js: "defaultFileExtensions", typ: a("") },
        { json: "isDefaultLocation", js: "isDefaultLocation", typ: true },
        { json: "route", js: "route", typ: "" },
        { json: "subRoutes", js: "subRoutes", typ: a(r("InstallRule")) },
        { json: "trackingMethod", js: "trackingMethod", typ: r("TrackingMethod") },
    ], false),
    "ModloaderPackage": o([
        { json: "loader", js: "loader", typ: r("Loader") },
        { json: "packageId", js: "packageId", typ: "" },
        { json: "rootFolder", js: "rootFolder", typ: "" },
    ], false),
    "PackageInstaller": o([
        { json: "description", js: "description", typ: "" },
        { json: "name", js: "name", typ: "" },
    ], false),
    "Platform": [
        "epic-games-store",
        "oculus-store",
        "origin",
        "other",
        "steam",
        "steam-direct",
        "xbox-game-pass",
    ],
    "GameInstanceType": [
        "game",
        "server",
    ],
    "GameSelectionDisplayMode": [
        "hidden",
        "visible",
    ],
    "TrackingMethod": [
        "none",
        "package-zip",
        "state",
        "subdir",
        "subdir-no-flatten",
    ],
    "Loader": [
        "bepinex",
        "gdweave",
        "godotml",
        "lovely",
        "melonloader",
        "none",
        "northstar",
        "recursive-melonloader",
        "return-of-modding",
        "shimloader",
    ],
};
