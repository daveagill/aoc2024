export function readLines(filename: string): string[] {
    const text = Deno.readTextFileSync(filename);
    return text.split('\n');
}

export function toHistogram<T>(arr: T[]): Map<T, number> {
    const histogram = new Map<T, number>();

    for (const item of arr) {
        histogram.set(item, (histogram.get(item) ?? 0) + 1);
    }

    return histogram;
}