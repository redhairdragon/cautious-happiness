import { IterationData } from "./iteration-data"
export class NodeData {
    rank: number;
    micro_batch_size: number;
    iteration_data: { [iteration: number]: IterationData };

    public minIteration: number = Infinity;
    public maxIteration: number = -1;
    public restart = 0;

    public constructor(record: any) {
        this.rank = record["global_rank"];
        this.micro_batch_size = record["micro_batch_size"];
        this.iteration_data = {};
    }

    public parseTimeEntry(record: any, next: any): string {
        if ("iteration" in record) {
            if (record["type"] === "Load Checkpoint") {
                this.restart += 1;
                record["iteration"] = next["iteration"]
                for (let it in this.iteration_data) {
                    if (it >= record["iteration"])
                        this.iteration_data[it].reCompute()
                }
            }
            let iter = record["iteration"];
            if (!(iter in this.iteration_data))
                this.iteration_data[iter] = new IterationData(iter);

            this.iteration_data[iter].addEntry(record);
            this.maxIteration = Math.max(this.maxIteration, parseInt(record["iteration"]))
            this.minIteration = Math.min(this.minIteration, parseInt(record["iteration"]))
        } else
            return "INVALID ENTRY: missing iteration " + record;
        return "";
    }

    public getRowsOfIter(iter: number) {
        return this.iteration_data[iter].getRows(this.rank);
    }
    public getDurations(iter: number) {
        return this.iteration_data[iter].getDurations();
    }

    public getIterationTimeInSecond(iter: number) {
        return this.iteration_data[iter].getIterationTimeInSecond();
    }

    public hasSaveCheckpoint(iter: number) {
        return this.iteration_data[iter].hasSaveCheckpoint
    }
    public hasLoadCheckpoint(iter: number) {
        return this.iteration_data[iter].hasLoadCheckpoint
    }
}