const express = require('express')  
const path = require('path')   
const exphbs = require('express-handlebars')
const app = express()
const influent = require('influent')
bodyParser = require('body-parser');


/*
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
})*/
///*
// connect to database
client = new influent.HttpClient({
        
        username: "temp_user",
        password: "1234abcd",
        
        
});
//*/
// initialization
client.injectSerializer(new influent.LineSerializer());
client.injectHttp(new influent.NodeHttp());
host = new influent.Host("http", "localhost", 8086);
// use stub elector, that always elects first host
client.injectElector(new influent.StubElector([ host ]));
batch = new influent.Batch({ database: "training" });

checked = false


app.engine('.hbs', exphbs({  
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')  
app.set('views', path.join(__dirname, 'views')) 

 
app.get('/', (request, response) => {  
  response.render('home', {
    check_status: 'check status: off'
  })
  
})

// POST method route

app.post('/checked', function (req, res) {
  checked = true
  res.render('home', {
    check_status: 'check status: on'
  })
  console.log("here");
  
  
})

app.post('/unchecked', function(req, res){
  checked = false
  res.render('home', {
    check_status: 'check status: off'
  })
})

app.use(bodyParser.json({ type: 'application/json',limit: '50mb' }))

app.post('/write_data', function(req, res){
  if(checked){

    data = req.body
    //console.log("body:" +req.body)
    userID = Date.now()
    for( i=0; i<600;i++){
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
      ms = data[i].time
      //console.log(ms);
      measurement = new influent.Measurement("motion_information");
      measurement.addField("userID", new influent.F64(userID))
      measurement.addField("acceleration_x", new influent.F64(acx))
      measurement.addField("acceleration_y", new influent.F64(acy))
      measurement.addField("acceleration_z", new influent.F64(acz))
      measurement.addField("accelerationIncludingGravity_x", new influent.F64(agx))
      measurement.addField("accelerationIncludingGravity_y", new influent.F64(agy))
      measurement.addField("accelerationIncludingGravity_z", new influent.F64(agz))
      measurement.addField("rotation_alpha", new influent.F64(aba))
      measurement.addField("rotation_beta", new influent.F64(abb))
      measurement.addField("rotation_gamma", new influent.F64(abg))
      measurement.addField("ms", new influent.F64(ms))
      /*
      measurement.addTag("acceleration_x", acx.toString())
      measurement.addTag("acceleration_y", acy.toString())
      measurement.addTag("acceleration_z", acz.toString())
      measurement.addTag("accelerationIncludingGravity_x", agx.toString())
      measurement.addTag("accelerationIncludingGravity_y", agy.toString())
      measurement.addTag("accelerationIncludingGravity_z", agz.toString())
      measurement.addTag("rotation_alpha", aba.toString())
      measurement.addTag("rotation_beta", abb.toString())
      measurement.addTag("rotation_gamma", abg.toString())
      */
      //measurement.setTimestamp(Date.now().toString());

      batch.add(measurement);
    
      client.write(batch)
      /*
      m.then(function(client){
  	console.log(aba);
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
      */
    }
  }
})


app.listen(3000)  
