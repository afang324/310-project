var Parking = (function () {
    function Parking(type, address, space) {
        this.type = type;
        this.address = address;
        this.space = space;
    }
    Parking.prototype.getType = function () {
        return this.type;
    };
    Parking.prototype.getAddress = function () {
        return this.address;
    };
    Parking.prototype.getSpace = function () {
        return this.space;
    };
    return Parking;
})();
module.exports = Parking;
