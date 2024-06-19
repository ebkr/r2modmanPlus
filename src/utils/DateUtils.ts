export function valueToReadableDate(date: number | Date): string {
    const dateObject: Date = new Date(date);
    return `${dateObject.toDateString()}, ${dateObject.toLocaleTimeString()}`
}
