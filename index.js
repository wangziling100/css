const express = require('express')  
const path = require('path')   
const exphbs = require('express-handlebars')
const app = express()
const influent = require('influent')
bodyParser = require('body-parser');



m = influent.createHttpClient({
        server: [
            {
                protocol: "http",
                host:     "localhost",
                port:     8086
            }
        ],
        username: "temp_user",
        password: "1234abcd",
        
        database: "training"
})

var checked = false


app.engine('.hbs', exphbs({  
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')  
app.set('views', path.join(__dirname, 'views')) 

 
app.get('/', (request, response) => {  
  response.render('home', {
    name: 'John'
  })
})

// POST method route
app.post('/test.js', function (req, res) {
  console.log("post")
})


app.post('/checked', function (req, res) {
  checked = true
  
  
})

app.post('/unchecked', function(req, res){
  checked = false
})

app.use(bodyParser.json({ type: 'application/json' }))

app.post('/write_data', function(req, res){
  data = req.body
  //console.log("body:" +req.body)
  
  for( i=0; i<100;i++){
    //console.log(data[i].acceleration_x)
    acx = data[i].acceleration_x
    acy = data[i].acceleration_y
    acz = data[i].acceleration_z

    agx = data[i].accelerationIncludingGravity_x
    agy = data[i].accelerationIncludingGravity_y
    agz = data[i].accelerationIncludingGravity_z

    aba = data[i].rotation_alpha
    abb = data[i].rotation_beta
    abg = data[i].rotation_gamma
    console.log(aba);
    m.then(function(client){
	//aba = data[i].rotation_alpha
	
	
	client.write({ key: "motion_sensor",
 		 value:0.1,
	   tags:{ 
		    
		    acceleration_x:acx.toString(),
		    acceleration_y:acy.toString(),
		    acceleration_z:acz.toString(),
		    
		    accelerationIncludingGravity_x:agx.toString(),
		    accelerationIncludingGravity_y:agy.toString(),
		    accelerationIncludingGravity_z:agz.toString(),

		    rotation_alpha:aba.toString(),
		    rotation_beta:abb.toString(),
  		    rotation_gamma:abg.toString()
		
		}
	    
	});
    });
  }
})


app.listen(3000)  
