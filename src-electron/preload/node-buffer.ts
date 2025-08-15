export function from(data: any, encoding?: 'utf8' | 'base64') {
    return Buffer.from(data, encoding);
}
