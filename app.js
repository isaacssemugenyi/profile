let express = require('express')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')

//connect to the database
const url = 'mongodb://127.0.0.1:27017/profile';
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
.then(('open', ()=>{console.log('connected');}))
.catch('error',()=>{console.log(error);})

let db = mongoose.connection;

//create a schema
let inquirySchema = new mongoose.Schema({
  inquiryName: { type: String, required: true }, 
  inquiryEmail: { type: String, required: true }, 
  inquiryMessage: { type: String, required: true }, 
  createdAt: Date 
})

const app = express()
app.use(bodyParser.json())

var urlencodedParser = bodyParser.urlencoded({extended: false})

app.use(express.static("public"))

app.set("view engine", "ejs")

let Inquire = mongoose.model('inquiry', inquirySchema);

app.get('/', (req, res)=>{ res.render('index') })

app.post('/contact', (req, res)=>{
  // let {name, email, message, createdAt} = req.body
  let dataSent = new Inquire({
      inquiryName: req.body._name,
      inquiryEmail: req.body._email,
      inquiryMessage: req.body._message,
      createdAt: new Date()
    })

  console.log('Data received', dataSent);
    db.collection('inquiry').insertOne(dataSent, (err, result)=>{
      if(err) console.error(err);
      console.log(result);
    })
  res.redirect('/')
})

/*app.use((req, res)=>{
  res.status(404).render('404')
})*/

let port = process.env.PORT || 3000;

app.listen(port, () => console.log("server running on port "+port))