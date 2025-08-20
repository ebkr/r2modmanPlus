type Transformer = (url: string) => string;

let transformers: Transformer[] = [];

export function addPackageUrlTransformer(transformer: Transformer) {
    transformers.push(transformer);
}

export function transformPackageUrl(url: string): string {
    let appliedUrl = url;
    for (let transformer of transformers) {
        appliedUrl = transformer(appliedUrl);
    }
    return appliedUrl;
}
