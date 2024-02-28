import express, { json } from "express"
import 'dotenv/config'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose"
import User from "./Models/userModel.js"
import Post from "./Models/postModel.js"
const app = express()
app.use(json())
app.get('/', (req, res) => {
    console.log("works");
})
/**connect to mongodb
 *  */
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected");
    })


/**for signup
 * 
 */
app.post('/signup', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    if (!password || !username) {
        res.status(422).json({ error: "please enter all fields" })

    }
    User.findOne({ name: username })
        .then((saveduser) => {
            if (saveduser) {
                return res.status(422).json({ error: "user already exist" })
            }
            const user = new User({
                name: username,
                password: password
            })
            user.save()
                .then(user => {
                    res.json({ message: "saved successfully" })
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
})

/**Sign in route
 * 
 */
app.post('/signin', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    console.log(username);
    // console.log(username);
    // if username and password not given
    if (!password || !username) {
        res.status(422).json({ error: "please enter all fields" })

    }
    // check password is correct
    User.findOne({ name: username })
        .then(saveduser => {
            if (!saveduser) {
                return res.status(422).json({ error: "invalid user it is" })
            }
            if (password == saveduser.password) {
                console.log(saveduser);


                const token = jwt.sign({ _id: saveduser._id }, process.env.SECRET_KEY)
                User.findByIdAndUpdate(saveduser._id,{$set:{jwt_token:token}})
                
                .then(()=>{
                    console.log("saved");
                    return res.json({ token });
                })
                .catch(err => {
                    console.error("Error saving token:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                });
            }
            else {
                return res.status(422).json({ error: "invalid user" })
            }
        })
        .catch(err => {
            console.log(err);
        })
})

/**proceted route for authenticated user only
 * 
 */
app.get('/post', (req, res) => {
    // get the authorization from headers
    const {authorization} = req.headers

    if (!authorization) {
        res.status(401).json({ error: "you be logged in" })
    }
    // remove Bearer from the token
    const token = authorization.replace("Bearer ", "")
    let _id;
    // verify the token and send the response
    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "you must be logged in" })

        }

         _id = payload._id
        
    })
    Post.find({postedBy:_id})
    .populate("postedBy","_id name")
    .then(posts=>{
        res.json(posts)
    })



})


app.post('/post',(req,res)=>{
    const title = req.body.title
    const body = req.body.body
    const {authorization} = req.headers
    if (!authorization) {
        res.status(401).json({ error: "you be logged in" })
    }
    // remove Bearer from the token
    const token = authorization.replace("Bearer ", "")

    // verify the token and send the response
    let _id;
    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "you must be logged in" })

        }

        _id = payload._id
        
    })
    const post = new Post({
        title:title,
        body:body,
        postedBy:_id
    })
    post.save()
    .then(savedpost=>{
        res.send("saved successfully")
    })
    .catch(err=>{
        res.json(err)
    })

})


app.delete('/delete',(req,res)=>{
    const todelete = req.body.postTitle
    const {authorization} = req.headers
    if (!authorization) {
        res.status(401).json({ error: "you be logged in" })
    }
    // remove Bearer from the token
    const token = authorization.replace("Bearer ", "")

    // verify the token and send the response
    let _id;
    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "you must be logged in" })

        }

        _id = payload._id
        
    })
    Post.findOneAndDelete({title:todelete,postedBy:_id})
    .then(msg=>{
        res.send("post deleted successfully");
    })

})

app.listen(process.env.PORT, () => {
    console.log("Listining on " + process.env.PORT);
})
