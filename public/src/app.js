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


// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
	console.log("e", e);
	// Prevent the mini-infobar from appearing on mobile
	e.preventDefault();
	// Stash the event so it can be triggered later.
	deferredPrompt = e;
	// Update UI notify the user they can install the PWA
	// showInstallPromotion();
	// Optionally, send analytics event that PWA install promo was shown.
	console.log(`'beforeinstallprompt' event was fired.`);
});

//
// let deferredPrompt;
//
// window.addEventListener('beforeinstallprompt', (event) => {
// 	console.log("BEFORE INSTALL PROMPT FIRES");
// 	event.preventDefault()
// 	deferredPrompt = event
// 	return false
// })

function showDeferredPrompt() {
	console.log("deferredPrompt", deferredPrompt);
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

function unregisterServiceWorkers() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations()
		         .then(registrations => {
			         console.log("registrations", registrations);
			         registrations.forEach(reg => {
				         reg.unregister()
			         })
			         alert("Service workers are unregistered successfully!")
		         })
		         .catch(error => {
			         alert("Error in unregistering service workers")
		         })
	}
}

let unregisterSw = document.querySelector('#unregister-sw');
unregisterSw.addEventListener('click', unregisterServiceWorkers);

let installBanner = document.querySelector('#install-banner');
installBanner.addEventListener('click', showDeferredPrompt);


var sharedMomentsArea = document.querySelector('#shared-moments');

function onSaveButtonClicked(event) {
	console.log("CLICKED");
	// Check if the caches supported by the browser
	if ('caches' in window) {
		caches.open('user-requested')
		      .then(cache => {
			      // cache.add('https://httpbin.org/get')
			      // cache.add('/src/images/sf-boat.jpg')
		      })
		      .catch()
	}
}

function createCard(data) {
	var cardWrapper = document.createElement('div');
	cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
	var cardTitle = document.createElement('div');
	cardTitle.className = 'mdl-card__title';
	cardTitle.style.backgroundImage = 'url(' + data.image + ')';
	cardTitle.style.backgroundSize = 'cover';
	cardTitle.style.height = '180px';
	cardWrapper.appendChild(cardTitle);
	var cardTitleTextElement = document.createElement('h2');
	cardTitleTextElement.className = 'mdl-card__title-text';
	cardTitleTextElement.textContent = data.title;
	cardTitleTextElement.style.color = 'white'
	cardTitle.appendChild(cardTitleTextElement);
	var cardSupportingText = document.createElement('div');
	cardSupportingText.className = 'mdl-card__supporting-text';
	cardSupportingText.textContent = data.location;
	cardSupportingText.style.textAlign = 'center';
	var cardSaveButton = document.createElement('button')
	cardSaveButton.textContent = 'Save'
	cardSaveButton.addEventListener('click', onSaveButtonClicked)
	cardSupportingText.appendChild(cardSaveButton)
	cardWrapper.appendChild(cardSupportingText);
	componentHandler.upgradeElement(cardWrapper);
	sharedMomentsArea.appendChild(cardWrapper);
}

function clearCards() {
	while (sharedMomentsArea.hasChildNodes()) {
		sharedMomentsArea.removeChild(sharedMomentsArea.lastChild)
	}
}

function updateUI(data) {
	clearCards()

	for (let i = 0; i < data.length; i++) {
		createCard(data[i])
	}
}

const url = 'https://httpbin.org/get'
let isNetworkDataReceived = false

fetch(url)
	.then(function (res) {
		isNetworkDataReceived = true
		return res.json();
	})
	.then(function (data) {
		let dataArray = []
		for (let key in data) {
			dataArray.push(data[key])
		}
		updateUI(dataArray)
	});

// Check if the caches supported by the browser
if ('caches' in window) {
	caches.match(url)
	      .then(response => {
		      if (response) {
			      return response.json()
		      }
	      })
	      .then(data => {
		      // console.log("data", data);
		      if (!isNetworkDataReceived) {
			      let dataArray = []
			      for (let key in data) {
				      dataArray.push(data[key])
			      }
			      updateUI(dataArray)
		      }
	      })
}
