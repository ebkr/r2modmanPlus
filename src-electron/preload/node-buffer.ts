export function from(data: any, encoding?: 'utf8') {
    return Buffer.from(data, encoding);
}
