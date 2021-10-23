const Login = require('../models/login')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//var SimpleCrypto = require("simple-crypto-js").default
//admin credentials
var adminName = "Saurabh Mahajan"
var adminPassword = "dsjdhf52dn8"
var adminSecretCode = "i_am_super_hero"

//owner credentials
var ownerName = "Ashwin Baid"
var ownerPassword = "reifhc735wn"
var ownerSecretCode = "i_am_super_hero_father"

//-------------------------
// Pagination : 
const index = (req,res,next) =>{

    // {pagination} : 
    Login.paginate({},{page : req.query.page, limit: req.query.limit})
    .then(data=>{
        res.status(200).json({
            data
        })
    })
    .catch(error =>{
        // res.json({
        //     message : "An error Occured: "+error
        // })
        res.status(400).json({
            error
        })
    })
}

//-------------------------

// not we write function for registration process
const register = (req,res,next)=>{
    if(req.body.personType == "USER"){
        // Login.findOne({nickName : {$eq : req.body.nickName}})
        Login.findOne({$or : [{nickName : req.body.nickName},{ phone : req.body.phone}]})
          .then(user1 =>{
             if(user1){
                res.json({
                   message : 'user already exist!'
                })
            }
             else{
                    bcrypt.hash(req.body.password,10,function(err,hashedPass){
                        if(err){
                            res.json({
                                error : err
                            })
                        }

                        let user = new Login({
                            
                            
                            nickName : req.body.nickName,
                            userName : req.body.userName,
                            secretCode : req.body.secretCode,
                            person : req.body.personType,
                            email : req.body.email,
                            phone : req.body.phone,
                            password : hashedPass,
                            message : req.body.message,
                            isUserLogin : false,
                            isAdminLogin : false,
                            isOwnerLogin : false
                        })
                        user.save()
                        .then(user =>{
                            res.json({
                                message : 'User Added Successfully!'
                            })
                        })
                        .catch(error=>{
                            res.json({
                                message : 'An error Occured!'
                            })
                        })

                    })
            }
        
        })
        // .catch(error=>{
        //     res.json({
        //         message : 'An error Occured!'
        //     })
        // })       
            
    }
}

// not we write function for login process
const login = (req,res,next)=>{
    var nickName = req.body.nickName
    var emailID = req.body.emailID
    var password = req.body.password
    var userID = req.body.userID
    //var em = "sdsdsd"
    Login.findOne({email : emailID})
    .then(user =>{
        if(user){
            // Login.findOne({$or : [{isOwnerLogin : false},{email : em}]})
            if(user.nickName == nickName){


                if(user.isOwnerLogin==false){
                    bcrypt.compare(password,user.password,function(err,result){
                        if(err){
                            res.json({
                                errr : err
                            })
                        }
                        if(result){

                           Login.findByIdAndUpdate(userID,{isUserLogin : true})
                           .then(()=>{
                               res.json({
                                   message : 'user login successfully!'
                               })
                           })
                           .catch(error =>{
                               res.json({
                                   message : 'An error Occured!'
                               })
                           })
                
        
                        }else{
                            res.json({
                                message : 'Password does not matched, if you forget the password please visit userForgetPassword route to change your password!'
                            })
                        }
                    })
                }else{
                    res.json({
                        message : 'Owner is loginned, you are not allowed to login right Now!'
                    })
                }
            
        }else{
            res.json({
                message : 'Please write your correct nickName!'
            })
        }
        } //
        else{
            res.json({
                message : 'No user found!'
            })
        }
    })
}

// admin login
const adminLogin = (req,res,next) =>{

    // var userNickName = req.body.userNickName

    // var adminEmailID = req.body.emailID
    // var adminPassword = req.body.password
    // var personType = req.body.personType
    var userNickName = req.body.userNickName
	var userID = req.body.userID
    var adminEmailID = req.body.emailID
    var adminPassword = req.body.password
	
	Login.findOne({person : "ADMIN"})
	.then(user =>{ //
		if(user){ //
			
			if(user.email == adminEmailID){ //
				
				bcrypt.compare(adminPassword,user.password,function(err,result){  //
                        if(err){
                            res.json({
                                errr : err
                            })
                        }
                        if(result){  //
                         
                           
                          Login.findOne({nickName : userNickName})
                        .then(user1=>{  //
                            if(user1){  //
                                    
                                    if(user1.isUserLogin==false && user1.isOwnerLogin==false){
                                        // now admin can login
        
                                            Login.findByIdAndUpdate(userID,{isAdminLogin : true})
                                            .then(()=>{
                                                res.json({
                                                    message : 'Admin login successfully!'
                                                })
                                            })
                                            .catch(error =>{
                                                res.json({
                                                    message : 'An error Occured!'
                                                })
                                            })
                                    }else{
                                        res.json({
                                            message : 'Admin is not allowed to login!'
                                        })
                                    }   
                            }else{  //
                            //    admin is accessing user which doesnot exist
                                res.json({
                                    message : 'user doesnot exist!'
                                })
                            }
                        })  //
        
                        }
                        else{   //
                            res.json({
                                message : 'Password does not matched, if you forget the password please visit adminForgetPassword route to change your password!'
                            })
                        }
                    }) //
				
			}
            else{  //
                res.json({
                    message : 'Your entered email id is not matching with admin email!'
                })
            }
			
			
		}
        else{ //
			res.json({
                message : 'You are not a admin!'
            })
		}
	}) //
}

//owner login
const ownerLogin = (req,res,next) =>{

	var userNickName = req.body.userNickName
  
    var ownerEmailID = req.body.emailID
    var ownerPassword = req.body.password
    var userID = req.body.userID
   // var personType = req.body.personType
	
	Login.findOne({person :"OWNER"})
	.then(user =>{
		
		if(user){
			if(user.email == ownerEmailID){
			
				bcrypt.compare(ownerPassword,user.password,function(err,result){  //
                        if(err){
                            res.json({
                                errr : err
                            })
                        }
                        if(result){  //
                         
                           
                          Login.findOne({nickName : userNickName})
                        .then(user1=>{  //
                            if(user1){  //
                                    
                                   if(user1.isUserLogin==false){
                                // now owner can login

                                            Login.findByIdAndUpdate(userID,{isOwnerLogin : true})
                                    .then(()=>{
                                        res.json({
                                            message : 'owner login successfully!'
                                        })
                                    })
                                    .catch(error =>{
                                        res.json({
                                            message : 'An error Occured!'
                                        })
                                    })
                            }else{
                                res.json({
                                    message : 'Owner is not allowed to login!'
                                })
                            }  
                            }else{  //
                            //    admin is accessing user which doesnot exist
                                res.json({
                                    message : 'user doesnot exist!'
                                })
                            }
                        })  //
        
                        }
                        else{   //
                            res.json({
                                message : 'Password does not matched, if you forget the password please visit ownerForgetPassword route to change your password!'
                            })
                        }
                    }) //
			
			}else{  //
					res.json({
						message : 'Your entered email id is not matching with owner email!'
					})
				}
		
		}else{ //
			res.json({
                message : 'You are not a owner!'
            })
		}
		
	})

}



//user logout
const userLogout = (req,res,next) =>{
    let userID = req.body.userID    // if user wants to logout
   // var userNickName = req.body.userNickName
    Login.findByIdAndUpdate(userID,{isUserLogin : false})
    .then(()=>{
        res.json({
            message : 'user logout successfully!'
        })
    })
    .catch(error =>{
        res.json({
            message : 'Invalid userID!'
        })
    })
}
//admin logout
const adminLogout = (req,res,next) =>{

    let userID = req.body.userID   // from which user admin wants to logout
   // var userNickName = req.body.userNickName
    Login.findByIdAndUpdate(userID,{isAdminLogin : false})
    .then(()=>{
        res.json({
            message : 'Admin logout successfully!'
        })
    })
    .catch(error =>{
        res.json({
            message : 'Invalid userID!'
        })
    })
}
//owner logout
const ownerLogout = (req,res,next) =>{

    let userID = req.body.userID   // from which user owner wants to logout
   // var userNickName = req.body.userNickName
    Login.findByIdAndUpdate(userID,{isOwnerLogin : false})
    .then(()=>{
        res.json({
            message : 'Owner logout successfully!'
        })
    })
    .catch(error =>{
        res.json({
            message : 'An error Occured!'
        })
    })
     // var userNickName = req.body.userNickName

    
}
//user forget password
const userForgetPassword = (req,res,next) =>{

    var userNickName = req.body.nickName
    var secretCodeCheck = req.body.secretCode
    var userID = req.body.userID
    var newPassword = req.body.newPassword

    Login.findOne({nickName : userNickName})  // user name for which we want to change the password
    .then(user =>{
        if(user){
            if(user.secretCode == secretCodeCheck){   // if secretCode matched then only give the access to the user to change password
                    bcrypt.hash(newPassword,10,function(err,hashedPass){
                        if(err){
                            res.json({
                                error : err
                            })
                        }
            
                        Login.findByIdAndUpdate(userID,{password : hashedPass})
                        .then(()=>{
                            res.json({
                                message : 'Password changed Successfully!'
                            })
                        })
                        .catch(error =>{
                            res.json({
                                message : 'An error Occured!'
                            })
                        })
                })
            }else{
                res.json({
                    message : 'Incorrect secret Code!'
                })
            }
        }else{
            res.json({
                message : 'user doesnot exist!'
            })
        }
    })
    .catch(error =>{
        res.json({
            message : 'An error Occured!'
        })
    }) 
    
}
//admin forget password
const adminForgetPassword = (req,res,next) =>{
    
    var adminUserName = req.body.adminName
    var secretCodeCheck = req.body.secretCode
     var adminNewPassword = req.body.newPassword
    // if(adminSecretCode == secretCode){
    //     adminPassword = adminNewPassword
    //     res.json({
    //         message : 'Password Changed Successfully!'
    //     })
    // }else{
    //     res.json({
    //         message : 'Wrong secretCode!'
    //     })
    // }
    Login.findOne({userName : adminUserName})  // user name for which we want to change the password
    .then(user =>{
        if(user){
            if(user.secretCode == secretCodeCheck){   // if secretCode matched then only give the access to the user to change password
                    bcrypt.hash(adminNewPassword,10,function(err,hashedPass){
                        if(err){
                            res.json({
                                error : err
                            })
                        }
                        Login.findByIdAndUpdate("617185ff5b8fdbdc3574c6ff",{password : hashedPass})
                        .then(()=>{
                            res.json({
                                message : 'Admin Password changed Successfully!'
                            })
                        })
                        .catch(error =>{
                            res.json({
                                message : 'An error Occured!'
                            })
                        })
                })
            }else{
                res.json({
                    message : 'Incorrect secret Code!'
                })
            }
        }else{
            res.json({
                message : 'Admin name is incorrect!'
            })
        }
    })
    .catch(error =>{
        res.json({
            message : 'An error Occured!'
        })
    }) 
}
//Owner forget password
const ownerForgetPassword = (req,res,next) =>{

    // var ownerNewPassword = req.body.newPassword
    // var secretCode = req.body.secretCode
    // if(ownerSecretCode == secretCode){
    //     ownerPassword = ownerNewPassword
    //     res.json({
    //         message : 'Password Changed Successfully!'
    //     })
    // }else{
    //     res.json({
    //         message : 'Wrong secretCode!'
    //     })
    // }
    var ownerUserName = req.body.ownerName
    var secretCodeCheck = req.body.secretCode
     var ownerNewPassword = req.body.newPassword
    // if(adminSecretCode == secretCode){
    //     adminPassword = adminNewPassword
    //     res.json({
    //         message : 'Password Changed Successfully!'
    //     })
    // }else{
    //     res.json({
    //         message : 'Wrong secretCode!'
    //     })
    // }
    Login.findOne({userName : ownerUserName})  // user name for which we want to change the password
    .then(user =>{
        if(user){
            if(user.secretCode == secretCodeCheck){   // if secretCode matched then only give the access to the user to change password
                    bcrypt.hash(ownerNewPassword,10,function(err,hashedPass){
                        if(err){
                            res.json({
                                error : err
                            })
                        }
                        Login.findByIdAndUpdate("617186385b8fdbdc3574c715",{password : hashedPass})
                        .then(()=>{
                            res.json({
                                message : 'Owner Password changed Successfully!'
                            })
                        })
                        .catch(error =>{
                            res.json({
                                message : 'An error Occured!'
                            })
                        })
                })
            }else{
                res.json({
                    message : 'Incorrect secret Code!'
                })
            }
        }else{
            res.json({
                message : 'Owner name is incorrect!'
            })
        }
    })
    .catch(error =>{
        res.json({
            message : 'An error Occured...!'
        })
    }) 
}
module.exports = {
    index, register,login, adminLogin, ownerLogin, userLogout, adminLogout, ownerLogout, userForgetPassword, adminForgetPassword, ownerForgetPassword
}