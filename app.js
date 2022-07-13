const express =require('express')
const mongoose=require('mongoose')
const Blog=require('./models/blog')

// express app
const app =express()


// connect to mongoDB
const dbURL='mongodb+srv://jacksonmintu:G9iPBBu5Dt0pIqzz@cluster0.k0qi4.mongodb.net/Learn_Node?retryWrites=true&w=majority'
mongoose.connect(dbURL,{useNewUrlParser:true,useUnifiedTopology:true})
.then((result)=>{
    console.log("conected to db")
}) .catch((err)=>console.log(err))

app.set('view engine','ejs')

// middle-ware & static files

app.use(express.static('public')) //this will check for static files in public folder
app.use(express.urlencoded({extended:true})) //used for posts if we didnt used this line then the post data will be undefined


// routes
app.get('/',(req,res)=>{
    // res.render('index',{title:'Home',blogs})
    res.redirect('/blogs')
})

app.get('/about',(req,res)=>{
    res.render('about',{title:'About'})
})

// blog routes
app.get('/blogs/create',(req,res)=>{
    res.render('create',{title:'Create'})
})

app.get('/blogs',(req,res)=>{
    Blog.find().sort({createdAt:-1})
    .then((result)=>{
        res.render('index',{title:'All Blogs',blogs:result})
    }).catch((err)=>console.log(err))
})

app.post('/blogs',(req,res)=>{
    const blog=new Blog(req.body)

    blog.save()
    .then((result)=>{
        res.redirect('/blogs')
    }).catch((err)=>console.log(err))
})

app.get('/blogs/:id',(req,res)=>{
    const id=req.params.id;
    Blog.findById(id)
    .then((result)=>{
        res.render('details',{blog:result,title:'Blog Details'})
    }).catch(err=>{
        console.log(err)
    })
})

app.delete('/blogs/:id',(req,res)=>{
    const id=req.params.id;
    Blog.findByIdAndDelete(id)
    .then(result=>{
        res.json({redirect:'/blogs'})
    }).catch(err=>console.log(err))
})

app.use((req,res)=>{
    res.status(404).render('404')
})

app.listen(3000)