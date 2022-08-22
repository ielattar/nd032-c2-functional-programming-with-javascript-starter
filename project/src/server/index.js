require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => {
				const json_response=res.json()
				//console.log(json_response)
				return json_response
				})
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/rovers/:rover', async (req, res) => {
    try {
		aRover=req.params.rover
		console.log(aRover);
	    /*https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity?api_key=ZBLDpiflRCxL7ra93X86kiRr6a3iJsPNCdOL8eWz*/
        let rover = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${aRover}?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({rover})
    } catch (err) {
        console.log('error:', err);
    }
})



app.get('/images/:rover', async (req, res) => {
    try {
		aRover=req.params.rover
		console.log(aRover);
	    /*https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity?api_key=ZBLDpiflRCxL7ra93X86kiRr6a3iJsPNCdOL8eWz*/
        let rover = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${aRover}/latest_photos?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({rover})
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))