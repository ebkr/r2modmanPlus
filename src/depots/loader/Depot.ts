export type ProtonRequired = {
    use_proton: boolean;
}

export type Depot = {
    [depotId: string]: ProtonRequired;
}
