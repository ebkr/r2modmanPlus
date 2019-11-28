import Mod from './Mod';
import ThunderstoreVersion from './ThunderstoreVersion';

export default class ThunderstoreMod extends ThunderstoreVersion {
    private versions: ThunderstoreVersion[] = [];
    private rating: number = 0;

    public parseFromThunderstoreData(data: any): ThunderstoreMod {
        this.setName(data.name);
        return this;
    }
}