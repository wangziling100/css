# css
# Description
It's a simple express app on server end, you can use your smartphone (android) to view a simple page that the app provides. 
The server wil collect your Acceleration Sensor Information and store it in influxDB

# Usage
1. Use your computer as a server, and run the express app on your computer
node index.js
2. Use docker to emulate influxDB
sudo docker run -p 127.0.0.1:8086:8086 -p 127.0.0.1:8083:8083 -v influxdb:/var/lib/influxdb  
-e INFLUXDB_ADMIN_ENABLED=true  influxdb
3. create a new database named training in influxdb
4. create a new measurement named motion_sensor in training
5. use your smartphone to search the page <your-computers-ip>:3000

maybe the follow dependencies package should you also install
node.js, express, body-parser, express-handebars and influent 
