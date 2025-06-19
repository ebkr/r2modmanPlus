import R2Error from "../errors/R2Error";

export enum GameInstanceType {
    GAME = "Game",
    SERVER = "Server"
}

export function gameInstanceTypeFromString(instanceType: string): GameInstanceType {
    switch (instanceType.toLowerCase()) {
        case "game": return GameInstanceType.GAME;
        case "server": return GameInstanceType.SERVER;
    }

    throw new R2Error(
        "Invalid game instance type identifier",
        `${instanceType} is not a valid game instance type.`
    )
}
