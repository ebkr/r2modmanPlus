declare module 'shell-quote' {
    export function parse(cmd: string): string[];
    export function quote(args: string[]): string;
}
