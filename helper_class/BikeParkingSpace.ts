
class BikeParkingSpace{
    private address: string;
    private space: string;
    
    constructor(address: string, space: string){
        this.address=address;
        this.space=space;
    }
    
    public getAddress=function() {
        return this.address;
    }
    
    public getSpace=function() {
        return this.space;
    }

}
export = BikeParkingSpace;