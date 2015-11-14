class AccountManager{
    private username: string;
    private password: string;
    private adminname: string;
    private adminpwd: string;
    
    constructor(){
        this.username=null;
        this.password=null;
        this.adminname=null;
        this.adminpwd=null;
        return this;
    }
    
    login=function(myUsername:string, myPassword:string){
        this.username=myUsername;
        this.password=myPassword;
    }
    
    logout=function(){
        this.username=null;
        this.password=null;
    }
    
    createAccount=function(myUsername:string, myPassword:string, collection){
        collection.insert({
            'username' : myUsername,
            'password' : myPassword,
            'favourite' : null
        }, function (e, doc) {
            if (e) {
                console.log(e);
            }
        });
        this.username = myUsername;
        this.password = myPassword;
    }
    
    createAdmin=function(adminname:string, adminpwd:string){
        this.adminname=adminname;
        this.adminpwd=adminpwd;        
    }
    
    //varify that if the account doesn't have sufficient permission, access is denied
    authenticate=function(authority:string):boolean{
        var adminValidated : boolean = (authority=='admin')&&(this.username==this.adminname);
        var userValidated : boolean = (authority=='user')&&(this.username!=null);
        if(adminValidated || userValidated){
            return true;
        }else{
            return false;
        }
    }
    
    getAdminName=function() {
        return this.adminname;
    }
    
    getAdminPwd=function() {
        return this.adminpwd;
    }
    
    getUsername=function() {
        return this.username;
    }
    
    getPassword=function() {
        return this.password;
    }
    
    setUsername=function(name:string){
        this.username=name;
    }
    
    setPassword=function(password:string){
        this.password=password;
    }
}
export = AccountManager;