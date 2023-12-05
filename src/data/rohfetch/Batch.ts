import { QueryBuilder } from "./QueryBuilder";

export class Batch {
    private _dependancies: Promise<any>[] = [];
    private _queries: QueryBuilder[] = [];

    addResolveBatchDependency(depOrDeps: Promise<any> | Promise<any>[]): void {
        const depArray = <Promise<any>[]> depOrDeps; 
        if(!depOrDeps || depArray.length === 0) {
            return;
        }
        if(depArray.length) {
            this._dependancies.push(...depArray);
            return;
        }
        this._dependancies.push(depOrDeps as Promise<any>);
    }

    push(query: QueryBuilder) {
        query._batch = this;
        this._queries.push(query);
    }

    async execute(): Promise<void> {
        return Promise.all([
            ...this._dependancies,
            ...this._queries.map(q => q._execute()),
        ]).then(r => undefined);
    }
}