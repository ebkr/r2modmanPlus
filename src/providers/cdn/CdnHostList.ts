let CDNS = [
    "https://gcdn.thunderstore.io",
    "https://hcdn-1.hcdn.thunderstore.io"
];

export function getCdns() {
    return [...CDNS];
}

export function setCdns(cdns: string[]) {
    CDNS = cdns;
}
