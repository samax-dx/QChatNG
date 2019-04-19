export class DeferredBuffer<T> {
    private _data: T | null = null;
    private _sink: (value: T) => void;

    fill(data: T): void {
        setTimeout(() => {
            if (this._sink) this._sink(data);
            else this._data = data;
        }, 0);
    }

    flush(sink: (value: T) => void): void {
        setTimeout(() => {
            if (this._data) sink(this._data);
            else this._sink = sink;
        }, 0);
    }
}
