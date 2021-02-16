import { NodeData } from "./node-data"

export class TimelineData {
    public node_data: { [rank: number]: NodeData } = {};
    current_rank: number = -1;
    public constructor() {
    }

    public getNodes() {
        return Object.keys(this.node_data);
    }

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
        for (let op of Object.keys(dict).sort()) {
            result.push([op, dict[op]])
        }
        return result
    }


    //return error message
    public parseRecord(record: any): string {
        if ("type" in record) {
            if (record["type"] === "META")
                return this.handleMetaEntry(record);
            else
                return this.handleTimeEntry(record);
        }
        return "INVALID RECORD: type is not found";
    }

    //return error message
    private handleMetaEntry(record: any): string {
        let error: string = "";
        this.current_rank = record["global_rank"];
        if (this.current_rank in this.node_data)
            return "INVALID RECORD: duplicated global_rank";
        this.node_data[this.current_rank] = new NodeData(record);
        return error;
    }

    //return error message
    private handleTimeEntry(record: any): string {
        if (this.current_rank == -1)
            return "MISSING META INFO";
        let error: string = this.node_data[this.current_rank].parseTimeEntry(record);
        return error;
    }
}