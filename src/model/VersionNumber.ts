import { isNumber } from 'util';
import ReactiveObjectConverterInterface from './safety/ReactiveObjectConverter';

export default class VersionNumber implements ReactiveObjectConverterInterface {
    private major: number = 0;
    private minor: number = 0;
    private patch: number = 0;

    public toString(): string {
        return `${this.major}.${this.minor}.${this.patch}`;
    }

    // constructor shouldn't return null, as a version of 0.0.0 is still reasonable.
    public constructor(versionNumber: string) {
        const splitNumbers: string[] = versionNumber.split('.');
        try {
            // If split isn't equal to 3 parts.
            if (splitNumbers.length !== 3) {
                throw Error(`VersionNumber: Split was incorrect length. Expect 3, got ${splitNumbers.length}`);
            }
            // Safetly convert split to numeric split.
            let numberArray: number[] = [];
            splitNumbers.forEach(strNum => {
                if (isNumber(Number(strNum))) {
                    numberArray = [...numberArray, Number(strNum)];
                } else {
                    throw Error(`VersionNumber: Number found was NaN. Received: ${splitNumbers}`);
                }
            })
            // If successful, assign values.
            this.major = numberArray[0];
            this.minor = numberArray[1];
            this.patch = numberArray[2];
        } catch(e) {
            // If an error was thrown, log reason.
            console.log(e, " - ", versionNumber);
        }
        return this;
    }

    public fromReactive(reactive: any): VersionNumber {
        this.major = reactive.major;
        this.minor = reactive.minor;
        this.patch = reactive.patch;
        return this;
    }
}