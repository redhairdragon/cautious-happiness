import { NodeData } from "./node-data"

export class TimelineData {
    public node_data: { [rank: number]: NodeData } = {};
    current_rank: number = -1;
    public typeSet: Set<string> = new Set();

    public constructor() {
    }

    public test() {
        console.log(this.node_data[0])
    }
    public getNodes() {
        return Object.keys(this.node_data);
    }

    public timeToIteration(iter: number) {
        let nodes: NodeData[] = Object.values(this.node_data);
        let max: number = 0;
        let min: number = Infinity;
        for (let i = 0; i < nodes.length; ++i) {
            min = Math.min(min, nodes[i].iteration_data[0].minTimestamp)
            max = Math.max(max, nodes[i].iteration_data[iter].maxTimestamp)
        }
        return max - min;
    }

    public saveOverhead(iter: number) {
        let nodes: NodeData[] = Object.values(this.node_data);
        for (let i = 0; i < nodes.length; ++i)
            if (!nodes[i].hasSaveCheckpoint(iter))
                return NaN
        let min: number = Infinity;
        let max: number = Infinity;
        for (let i = 0; i < nodes.length; ++i) {
            let index = nodes[i].iteration_data[iter].saveCheckpointIdx
            let start: number = nodes[i].iteration_data[iter].data[index].start;
            let end: number = nodes[i].iteration_data[iter].data[index + 1].start;
            min = Math.min(start, min)
            max = Math.min(end, max)
        }
        return max - min
    }
    public loadOverhead(iter: number) {
        let nodes: NodeData[] = Object.values(this.node_data);
        for (let i = 0; i < nodes.length; ++i) {
            // console.log(!nodes[i].hasLoadCheckpoint(iter))
            if (!nodes[i].hasLoadCheckpoint(iter))
                return NaN
        }

        let min: number = Infinity;
        let max: number = Infinity;
        for (let i = 0; i < nodes.length; ++i) {
            let index = nodes[i].iteration_data[iter].loadCheckpointIdx
            let start: number = nodes[i].iteration_data[iter].data[index].start;
            let end: number = nodes[i].iteration_data[iter].data[index + 1].start;
            min = Math.min(start, min)
            max = Math.min(end, max)
        }
        return max - min
    }


    public getIterationTimeInSecond(iter: number) {
        let nodes: NodeData[] = Object.values(this.node_data);
        let max = 0;
        for (let i = 0; i < nodes.length; ++i) {
            max = Math.max(max, nodes[i].getIterationTimeInSecond(iter))
        }
        return max;
    }

    public isRecomputed(iter: number) {
        let nodes: NodeData[] = Object.values(this.node_data);
        for (let i = 0; i < nodes.length; ++i) {
            if (nodes[i].iteration_data[iter].reComputed) return true;
        }
        return false;
    }

    public numberOfRestart() {
        let nodes: NodeData[] = Object.values(this.node_data);
        for (let i = 0; i < nodes.length; ++i)
            return nodes[i].restart;
        return -1
    }

    //iteration range [0: #of iteration]
    public getIterationRange() {
        let min = Infinity;
        let max = -1;
        let nodes: NodeData[] = Object.values(this.node_data);
        for (let i = 0; i < nodes.length; ++i) {
            min = Math.min(min, nodes[i].minIteration)
            max = Math.max(max, nodes[i].maxIteration)
        }
        return [min, max];
    }

    public get2Darray(iter: number) {
        if (iter == -1)
            return [["0", "0", 0, 0]];
        let ranks = this.getNodes()
        let result = [];
        for (let r in ranks) {
            let rows = this.node_data[r].getRowsOfIter(iter);
            for (let row of rows)
                result.push(row);
        }
        return result;
    }

    public getPieArray(iter: number, rank: number) {
        if (iter == -1)
            return [["tmp", 1]];
        let nodeData = this.node_data[rank];
        let dict = nodeData.getDurations(iter)
        let result = []
        for (let op of Array.from(this.typeSet).sort()) {
            if (op in dict)
                result.push([op, dict[op]])
            else
                result.push([op, 0])
        }
        return result
    }

    //return error message
    public parseRecord(record: any, next: any): string {
        if ("type" in record) {
            if (record["type"] === "META")
                return this.handleMetaEntry(record);
            else {
                this.typeSet.add(record["type"])
                return this.handleTimeEntry(record, next);
            }
        }
        return "INVALID RECORD: type is not found";
    }

    //return error message
    private handleMetaEntry(record: any): string {
        let error: string = "";
        this.current_rank = record["global_rank"];
        if (!(this.current_rank in this.node_data))
            this.node_data[this.current_rank] = new NodeData(record);

        return error;
    }

    //return error message
    private handleTimeEntry(record: any, next: any): string {
        if (this.current_rank == -1)
            return "MISSING META INFO";
        let error: string = this.node_data[this.current_rank].parseTimeEntry(record, next);
        return error;
    }
}