class Parking {
    private type: string;
    private address: string;
    private space: number;
    private lat: number;
    private long: number;
    private comment: string;

    constructor(type: string, address: string, space:number) {
        this.type = type;
        this.address = address;
        this.space = space;
    }

    getType(): string {
        return this.type;
    }

    getAddress(): string {
        return this.address;
    }

    getSpace(): number {
        return this.space;
    }
}
export = Parking;

