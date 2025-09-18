export type CdnDefinition = {
    protocol: string;
    host: string;
}

let CDNS: CdnDefinition[] = [
    { protocol: 'https', host: 'gcdn.thunderstore.io'},
    { protocol: 'https', host: 'hcdn-1.hcdn.thunderstore.io' },
];

export function getCdns(): CdnDefinition[] {
    return [...CDNS];
}

export function setCdns(cdns: CdnDefinition[]) {
    CDNS = cdns;
}
