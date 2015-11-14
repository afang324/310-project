var AccountManager = (function () {
    function AccountManager() {
        this.login = function (myUsername, myPassword) {
            this.username = myUsername;
            this.password = myPassword;
        };
        this.logout = function () {
            this.username = null;
            this.password = null;
        };
        this.createAccount = function (myUsername, myPassword, collection) {
            collection.insert({
                'username': myUsername,
                'password': myPassword,
                'favourite': null
            }, function (e, doc) {
                if (e) {
                    console.log(e);
                }
            });
            this.username = myUsername;
            this.password = myPassword;
        };
        this.createAdmin = function (adminname, adminpwd) {
            this.adminname = adminname;
            this.adminpwd = adminpwd;
        };
        //varify that if the account doesn't have sufficient permission, access is denied
        this.authenticate = function (authority) {
            var adminValidated = (authority == 'admin') && (this.username == this.adminname);
            var userValidated = (authority == 'user') && (this.username != null);
            if (adminValidated || userValidated) {
                return true;
            }
            else {
                return false;
            }
        };
        this.getAdminName = function () {
            return this.adminname;
        };
        this.getAdminPwd = function () {
            return this.adminpwd;
        };
        this.getUsername = function () {
            return this.username;
        };
        this.getPassword = function () {
            return this.password;
        };
        this.setUsername = function (name) {
            this.username = name;
        };
        this.setPassword = function (password) {
            this.password = password;
        };
        this.username = null;
        this.password = null;
        this.adminname = null;
        this.adminpwd = null;
        return this;
    }
    return AccountManager;
})();
module.exports = AccountManager;
