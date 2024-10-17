export const splitToNameAndVersion = (dependencyString: string): [string, string] => {
    const parts = dependencyString.split('-');

    // Legacy team names can contain hyphens, so we can't be sure how
    // many there are in a dependency string.
    if (parts.length < 3) {
        throw new Error(`Invalid dependency string "${dependencyString}"`);
    }

    const version = parts.pop()!;
    const fullName = parts.join('-');
    return [fullName, version];
};
