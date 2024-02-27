import express, { json } from "express"
import 'dotenv/config'
import jwt from 'jsonwebtoken'

const app = express()
app.use(json())

app.get('/',(req,res)=>{
    console.log("works");
})

/**Sign in route
 * 
 */
app.post('/signin' ,(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    // console.log(username);
    // if username and password not given
    if(!password||!username){
        res.status(422).json({error:"please enter all fields"})

    }
    // check password is correct
    if(password==process.env.PASS){
        // sign jwt token and give it to response
        const token = jwt.sign({username},process.env.SECRET_KEY)
        res.json({token})
    }
    else{
        return res.status(422).json({error:"invalid user"})
    }
})
/**proceted route for authenticated user only
 * 
 */
app.get('/post',(req,res)=>{
    // get the authorization from headers
    const {authorization} = req.headers

    if(!authorization){
        res.status(401).json({error:"you be logged in"})
    }
    // remove Bearer from the token
    const token = authorization.replace("Bearer ","")

    // verify the token and send the response
    jwt.verify(token,process.env.SECRET_KEY,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must be logged in"})

        }
    
        const username = payload
        res.send(username)
    })


    })





app.listen(process.env.PORT,()=>{
    console.log("Listining on " + process.env.PORT);
})
