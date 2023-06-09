const express=require('express')
const router=express.Router({mergeParams:true})
const catchAsync=require('../utils/catchAsync')
const user=require('../models/user')
const passport = require('passport')
const {passpattern}=require('../middleware');


router.get('/register',(req,res)=>{
    res.render('users/registerform')//rendering register form 
})

router.post('/register',passpattern,catchAsync(async(req,res)=>{
    try{
        const {username,email,password}=req.body
        const newuser=new user({email,username})
        const registereduser=await user.register(newuser,password)
        req.login(registereduser,(err)=>{//this will enable us to login instataniously after a user register, with out it user will have to login manualy after registering. 
            if(err)return next(err)
            req.flash('success','Successfully registered!')
            res.redirect('/blogs')
        })
        
    }catch(e){
        req.flash('error','e.message')
        res.redirect('/register')
    }
    
}))

router.get('/login',(req,res)=>{
    res.render('users/loginform')
})
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','You loggedin successfully')
    const redirect=req.session.returnTo || '/blogs'
    delete req.session.returnTo
    res.redirect(redirect)
})

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Goodbye!");
      return res.redirect('/blogs');
    });
  });

// router.get('/admin',(req,res)=>{
//     res.render('/users/admin')
// })

// router.post('/admin',(req,res,next)=>{

// })

module.exports=router