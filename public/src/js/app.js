// Checking if the service worker available in the browser
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register("/service-worker.js")
	         .then(res => {
		         console.log("Service worker registered!")
	         })
	         .catch(error => {
		         console.error(error)
	         })
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
	console.log("BEFORE INSTALL PROMPT FIRES");
	// event.preventDefault()
	deferredPrompt = event
	return false
})


function plusButtonClicked() {
	if (deferredPrompt) {
		deferredPrompt.prompt()
		deferredPrompt.userChoice.then((res) => {
			console.log("RES", res)
			if (res.outcome === 'dismissed') {
				console.log("USER CANCELED INSTALLATION");
			} else {
				console.log("USER ADDED TO HOME SCREEN");
			}
		})

		deferredPrompt = null
	}
}

let plusButton = document.querySelector('#plus-button');
plusButton.addEventListener('click', plusButtonClicked);

// Get the user's IP address
// API reference: http://httpbin.org/
fetch('https://httpbin.org/ip')
	.then(response => {
		console.log("RES", response)
		return response.json()
	})
	.then(response => {
		console.log(response)
	})
	.catch(err => {
		console.log("ERR", err)
	})

// API reference: http://httpbin.org/
fetch('https://httpbin.org/post', {
	method: "POST",
	headers: {
		'Content-type': 'application/json',
		'Accept': 'application/json'
	},
	mode: 'cors',
	body: JSON.stringify({message: "Does this work?"})
})
	.then(response => {
		console.log("RES", response)
		return response.json()
	})
	.then(response => {
		console.log(response)
	})
	.catch(err => {
		console.log("ERR", err)
	})
