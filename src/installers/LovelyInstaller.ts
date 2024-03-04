import { InstallArgs, PackageInstaller } from "./PackageInstaller";
import path from "path";
import { InstallRuleInstaller } from "./InstallRuleInstaller";

export class LovelyInstaller extends PackageInstaller {
    readonly installer = new InstallRuleInstaller({
        gameName: "Balatro",
        rules: [
            {
                route: path.join("shimloader", "mod"),
                isDefaultLocation: true,
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR",
                subRoutes: [],
            },
            {
                route: path.join("shimloader", "pak"),
                defaultFileExtensions: [],
                trackingMethod: "SUBDIR",
                subRoutes: [],
            },
            {
                route: path.join("shimloader", "cfg"),
                defaultFileExtensions: [],
                trackingMethod: "NONE",
                subRoutes: [],
            }
        ]
    });

    async install(args: InstallArgs) {
        await this.installer.install(args);
    }
}
