var BikeParkingSpace = (function () {
    function BikeParkingSpace(address, space) {
        this.getAddress = function () {
            return this.address;
        };
        this.getSpace = function () {
            return this.space;
        };
        this.address = address;
        this.space = space;
    }
    return BikeParkingSpace;
})();
module.exports = BikeParkingSpace;
