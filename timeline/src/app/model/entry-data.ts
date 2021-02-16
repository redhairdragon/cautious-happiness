export class EntryData {
    public type: string;
    public start: number;
    public end: number;
    public constructor(type: string, start: number, end: number) {
        this.type = type; this.start = start; this.end = end;
    }

}
