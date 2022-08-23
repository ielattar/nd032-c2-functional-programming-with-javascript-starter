let store = {
    user: { name: "Ihab" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
	data:'',
	images:'',
	active_rover:'Curiosity'
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod , data, active_rover,images } = state

    return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(apod)}
				${RoversDetails(rovers,active_rover,data,images)}
            </section>
        </main>
        <footer></footer>
    `
}


// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})


function activateRover(rover){
	//alert(store.active_rover);
	//alert(rover);
	store.active_rover=rover;
	getRoverData(store);
	getRoverImages(store);
	//alert(document.getElementById("roverButton").innerHTML);
}

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    //console.log(photodate.getDate(), today.getDate());
    //console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod && apod.image.url}" height="350px" width="100%" />
            <p>${apod && apod.image.explanation}</p>
        `)
    }
}


const RoversDetails = (rovers, active_rover,data,images)=>{
	rover_buttons= rovers.map(rover => {return `<button id="roverButton" onclick="activateRover(this.innerHTML)">${rover}</button>`})
	
	if (!data) {
        getRoverData(store);
    }
	
	if (!images){
		getRoverImages(store);
	}
	
	rovers_html = rover_buttons.reduce((prev,curr)=> {return prev+curr});
	
	active_rover_html=`
	<p><b> Rover Name : </b>${data && data.rover.rover.name}</p>
	<p><b> Launch Date : </b>${data && data.rover.rover.launch_date}</p>
	<p><b> Landing Date : </b>${data && data.rover.rover.landing_date}</p>
	<p><b> Status : </b>${data && data.rover.rover.status}</p>
	`;
	
	
	images_html=`<br/>
			<img src="${images && images.rover.latest_photos[0].img_src}" height="100%" width="100%" />
			<p>${images && images.rover.latest_photos[0].earth_date}</p>
	
	`;
	
	return rovers_html+active_rover_html+images_html
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state
    //console.log(apod);
    fetch(`http://localhost:3000/apod`)
        .then(res => {
			json_response=res.json();
			//console.log(json_response);
		 return json_response}
			)
        .then(apod => {
			//console.log(apod);
			updateStore(store, { apod })
			
		})
        
    //return data
}


/* const getRoversData = (state) => {

    let { rovers } = state
    rovers.map (arover => {
     fetch(`http://localhost:3000/rovers/${arover}`)
        .then(res => res.json())
        .then(data => {
			console.log(data);
			updateStore(store, { data })
		})
		
	})
	console.log(store);
} */


const getRoverData = (state) => {

    let {active_rover} = state    
    fetch(`http://localhost:3000/rovers/${active_rover}`)
        .then(res => res.json())
        .then(data => {
			//console.log(data);
			updateStore(store, { data })
		})
		

	//console.log(store);
}


const getRoverImages = (state) => {

    let {active_rover} = state    
    fetch(`http://localhost:3000/images/${active_rover}`)
        .then(res => res.json())
        .then(images => {
			//console.log(data);
			updateStore(store, { images })
		})
		

	console.log(store);
}
      

