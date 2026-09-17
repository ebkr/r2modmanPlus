export function valueToReadableDate(date: number | Date | string): string {
    const dateObject: Date = new Date(date);
    return `${dateObject.toDateString()}, ${dateObject.toLocaleTimeString()}`
}
