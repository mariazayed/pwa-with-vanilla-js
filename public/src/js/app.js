// Add the promise object to the browser if it doesn't support it by default (for older browsers)
if (!window.Promise) {
	window.Promise = Promise
}

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
	// console.log("BEFORE INSTALL PROMPT FIRES");
	// event.preventDefault()
	deferredPrompt = event
	return false
})


function plusButtonClicked() {
	if (deferredPrompt) {
		deferredPrompt.prompt()
		deferredPrompt.userChoice.then((res) => {
			// console.log("RES", res)
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
