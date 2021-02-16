import { IterationData } from "./iteration-data"
export class NodeData {
    rank: number;
    micro_batch_size: number;
    iteration_data: { [iteration: number]: IterationData };

    public minIteration: number = Infinity;
    public maxIteration: number = -1;

    public constructor(record: any) {
        this.rank = record["global_rank"];
        this.micro_batch_size = record["micro_batch_size"];
        this.iteration_data = {};
    }

    public parseTimeEntry(record: any): string {
        if ("iteration" in record) {
            this.maxIteration = Math.max(this.maxIteration, parseInt(record["iteration"]))
            this.minIteration = Math.min(this.minIteration, parseInt(record["iteration"]))

            let iter = record["iteration"];
            if (!(iter in this.iteration_data))
                this.iteration_data[iter] = new IterationData(iter);
            this.iteration_data[iter].addEntry(record);
        } else
            return "INVALID ENTRY: missing iteration " + record;
        return "";
    }

    public getRowsOfIter(iter: number) {
        return this.iteration_data[iter].getRows(this.rank);
    }


}