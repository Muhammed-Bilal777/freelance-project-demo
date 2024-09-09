export default  (user,statusCode,res,message)=>{

    let token = user.getJwtToken();

    

    let options={
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE_IN * 24 * 60 * 60 *1000
        )
        ,
        httpOnly: true, // set to true
        secure: true,
        sameSite: 'none',
        path: '/',
      domain: 'localhost:3000' || 'https://freelance-project-demo-2.onrender.com/',

    }

    res.status(statusCode).cookie('token',token,options).json({
    message,
        token
    })
    console.log(token);
}