let CDNS = [
    "gcdn.thunderstore.io",
    "hcdn-1.hcdn.thunderstore.io"
];

export function getCdns() {
    return [...CDNS];
}

export function setCdns(cdns: string[]) {
    CDNS = cdns;
}
