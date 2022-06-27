export default abstract class BaseSettingsMigration {

    public abstract version(): number;
    public abstract migrate(): Promise<void>;

}
