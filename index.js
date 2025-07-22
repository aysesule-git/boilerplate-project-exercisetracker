const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongo = require("mongoose");
const router = require("./routes/user");

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(express.urlencoded({ extended: true }));

mongo.connect(process.env.MONGO, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('Connected to MongoDB!'));

app.use("/api/users", router);


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
