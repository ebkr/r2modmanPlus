import bundledEcosystemSchema from "../../assets/data/ecosystem.json";

export function getRegisteredGames(): string[] {
    return JSON.parse(localStorage.getItem("EcosystemGameStatus.RegisteredGames") ?? "[]");
}

export function registerGames(games: string[]): void {
    const registeredGames = new Set(getRegisteredGames());
    for (const game of games) {
        if (registeredGames.has(game)) {
            continue;
        }
        registeredGames.add(game);
        localStorage.setItem(`EcosystemGameStatus.Game.${game}`, new Date().getTime().toString());
    }
    localStorage.setItem("EcosystemGameStatus.RegisteredGames", JSON.stringify([...registeredGames]));
}

export function isGameNewlyAdded(game: string): boolean {
    const gameTime = localStorage.getItem(`EcosystemGameStatus.Game.${game}`) as string;
    if (!gameTime) {
        return false;
    }
    if ((bundledEcosystemSchema.games as any)[game]?.r2modman) {
        return false;
    }
    const now = new Date().getTime();
    return (now - parseInt(gameTime)) < 3 * 24 * 60 * 60 * 1000;
}
