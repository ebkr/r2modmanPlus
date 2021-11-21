export default abstract class BaseSettingsMigration {

    public abstract version(): number;
    public abstract async migrate(): Promise<void>;

}
