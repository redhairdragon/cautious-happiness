import { EntryData } from "./entry-data"
export class IterationData {
    data: EntryData[] = [];
    iteration: number;

    constructor(iteration: number) {
        this.iteration = iteration;
    }

    public addEntry(entry: any) {
        this.data.push(new EntryData(entry["type"], entry["start"], entry["end"]));
    }

    public getRows(rank: number) {
        let result = [];
        for (let entry of this.data)
            result.push(['Node ' + rank, entry.type, entry.start * 1000, entry.end * 1000])
        return result;
    }

    public getDurations() {
        let result: { [key: string]: number } = {}
        for (let entry of this.data) {
            if (entry.type in result)
                result[entry.type] += (entry.end - entry.start)
            else
                result[entry.type] = (entry.end - entry.start)
        }
        return result;
    }

}
