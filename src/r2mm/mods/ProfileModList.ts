import * as yaml from 'yaml';
import Profile from 'src/model/Profile';
import Mod from 'src/model/Mod';

import * as fs from 'fs-extra';
import * as path from 'path';
import FileNotFoundError from 'src/model/errors/FileNotFoundError';
import R2Error from 'src/model/errors/R2Error';
import YamlParseError from 'src/model/errors/Yaml/YamlParseError';
import YamlConvertError from 'src/model/errors/Yaml/YamlConvertError';
import FileWriteError from 'src/model/errors/FileWriteError';

export default class ProfileModList {

    public static getModList(profile: Profile): Mod[] | R2Error {
        try {
            const buf: Buffer = fs.readFileSync(
                path.join(profile.getPathOfProfile(), 'mods.yml')
            );
            try {
                const modList: Mod[] = yaml.parse(buf.toString())
                    .map((mod: Mod) => new Mod().fromReactive(mod));
                return modList;
            } catch(e) {
                const err: Error = e;
                return new YamlParseError(
                    `Failed to parse yaml file of profile: ${profile.getProfileName()}/mods.yml`,
                    err.message
                );
            }
        } catch(e) {
            const err: Error = e;
            return new FileNotFoundError(
                'Unable to locate file',
                err.message
            )
        }
    }

    private static saveModList(profile: Profile, modList: Mod[]): R2Error | null {
        try {
            const yamlModList: string = yaml.stringify(modList);
            try {
                fs.writeFileSync(
                    path.join(profile.getPathOfProfile(), 'mods.yml'),
                    yamlModList
                );
            } catch(e) {
                const err: Error = e;
                return new FileWriteError(
                    `Failed to create mods.yml for profile: ${profile.getProfileName()}`,
                    err.message
                )
            }
        } catch(e) {
            const err: Error = e;
            return new YamlConvertError(
                'Failed to convert modLiist to yaml',
                err.message
            );
        }
        return null;
    }

    public static addMod(mod: Mod): Mod[] | R2Error {
        this.removeMod(mod);
        let currentModList: Mod[] | R2Error = this.getModList(Profile.getActiveProfile());
        if (currentModList instanceof R2Error) {
            currentModList = [];
        }
        const saveError: R2Error | null = this.saveModList(Profile.getActiveProfile(), [...currentModList, mod]);
        if (saveError !== null) {
            return saveError;
        }
        // Return mod list, or R2 error. We don't care at this point.
        return this.getModList(Profile.getActiveProfile());
    }

    public static removeMod(mod: Mod): Mod[] | R2Error {
        const currentModList: Mod[] | R2Error = this.getModList(Profile.getActiveProfile());
        if (currentModList instanceof R2Error) {
            return currentModList;
        }
        const newModList = currentModList.filter((m: Mod) => m.getFullName() !== mod.getFullName());
        const saveError: R2Error | null = this.saveModList(Profile.getActiveProfile(), newModList);
        if (saveError !== null) {
            return saveError;
        }
        // Return mod list, or R2 error. We don't care at this point.
        return this.getModList(Profile.getActiveProfile());
    }

    public static updateMod(mod: Mod, apply: (mod: Mod) => void): Mod[] | R2Error {
        const list: Mod[] | R2Error = this.getModList(Profile.getActiveProfile());
        if (list instanceof R2Error) {
            return list;
        }
        const newList: Mod[] = [];
        list.forEach((listMod: Mod) => {
            if (listMod.getFullName() !== mod.getFullName()) {
                newList.push(listMod);
            } else {
                apply(listMod);
                newList.push(listMod);
            }
        });
        return newList;
    }

}