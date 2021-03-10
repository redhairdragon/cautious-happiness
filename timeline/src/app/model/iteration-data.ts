import { EntryData } from "./entry-data"
export class IterationData {
    data: EntryData[] = [];
    iteration: number;
    reComputed: boolean;

    hasSaveCheckpoint: boolean = false;
    hasLoadCheckpoint: boolean = false;
    public loadCheckpointIdx: number = -1;
    public saveCheckpointIdx: number = -1;

    public minTimestamp: number = Infinity;
    public maxTimestamp: number = -1;

    constructor(iteration: number) {
        this.iteration = iteration;
        this.reComputed = false;
    }

    public reCompute() {
        this.data = []
        this.reComputed = true;
        this.hasSaveCheckpoint = false;
    }

    public addEntry(entry: any) {
        this.minTimestamp = Math.min(this.minTimestamp, entry["start"])
        this.maxTimestamp = Math.max(this.maxTimestamp, entry["end"])
        if (entry["type"] === "Save Checkpoint") {
            this.saveCheckpointIdx = this.data.length;
            this.hasSaveCheckpoint = true;
        }
        if (entry["type"] === "Load Checkpoint") {
            console.log(entry)
            this.loadCheckpointIdx = this.data.length;
            this.hasLoadCheckpoint = true;
        }

        this.data.push(new EntryData(entry["type"], entry["start"], entry["end"]));
    }

    public getRows(rank: number) {
        let result = [];
        for (let entry of this.data)
            result.push(['Node ' + rank, entry.type, (entry.start) * 1000, (entry.end) * 1000])
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

    public getIterationTimeInSecond() {
        return this.maxTimestamp - this.minTimestamp;
    }
}
