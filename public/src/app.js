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

let sharedMomentsArea = document.querySelector('#shared-moments');

// Firebase initialization
initFirebase()
const postsList = getPosts()
postsList.then(posts => {
	console.log("posts in app.js", posts);
	updateUI(posts)
	for (const key in posts) {
		writeData('posts', posts[key])
	}

})

// Check if the indexedDB supported by the browser
if ('indexedDB' in window) {
	console.log("INDEXDB");
	readAllData('posts')
		.then((data) => {
			if (!isNetworkDataReceived) {
				console.log("FROM IDB", data);
				updateUI(data)
			}
		})
}

// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
	console.log("BEFORE INSTALL PROMPT FIRES");

	// Prevent the mini-infobar from appearing on mobile
	e.preventDefault();

	deferredPrompt = e;
	// Optionally, send analytics event that PWA install promo was shown.
});

// Buttons actions
let unregisterSw = document.querySelector('#unregister-sw');
unregisterSw.addEventListener('click', unregisterServiceWorkers);

function unregisterServiceWorkers() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations()
		         .then(registrations => {
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

let installBanner = document.querySelector('#install-banner');
installBanner.addEventListener('click', showDeferredPrompt);

function showDeferredPrompt() {
	if (deferredPrompt) {
		deferredPrompt.prompt()
		deferredPrompt.userChoice.then((res) => {
			if (res.outcome === 'dismissed') {
				console.log("USER CANCELED INSTALLATION");
			} else {
				console.log("USER ADDED TO HOME SCREEN");
			}
		})
		deferredPrompt = null
	}
}

function createCard(data) {
	const cardWrapper = document.createElement('div');
	cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';

	const cardTitle = document.createElement('div');
	cardTitle.className = 'mdl-card__title';
	cardTitle.style.backgroundImage = 'url(' + data.image + ')';
	cardTitle.style.backgroundSize = 'cover';
	cardTitle.style.height = '180px';
	cardWrapper.appendChild(cardTitle);

	const cardTitleTextElement = document.createElement('h2');
	cardTitleTextElement.className = 'mdl-card__title-text';
	cardTitleTextElement.textContent = data.title;
	cardTitleTextElement.style.color = 'white'
	cardTitle.appendChild(cardTitleTextElement);

	const cardSupportingText = document.createElement('div');
	cardSupportingText.className = 'mdl-card__supporting-text';
	cardSupportingText.textContent = data.location;
	cardSupportingText.style.textAlign = 'center';

	const cardSaveButton = document.createElement('button')
	cardSaveButton.textContent = 'Save'
	cardSaveButton.addEventListener('click', onSaveButtonClicked)
	cardSupportingText.appendChild(cardSaveButton)

	cardWrapper.appendChild(cardSupportingText);
	componentHandler.upgradeElement(cardWrapper);
	sharedMomentsArea.appendChild(cardWrapper);
}

function onSaveButtonClicked(event) {
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

function updateUI(data) {
	clearCards()

	for (let i = 0; i < data.length; i++) {
		createCard(data[i])
	}
}

function clearCards() {
	while (sharedMomentsArea.hasChildNodes()) {
		sharedMomentsArea.removeChild(sharedMomentsArea.lastChild)
	}
}

let isNetworkDataReceived = false

// fetch(url, {
// 	method: 'POST',
// 	headers: {
// 		'Content-Type': 'application/json',
// 		'Accept': 'application/json'
// 	},
// 	body: JSON.stringify({
// 		                     message: 'Some message'
// 	                     })
// })
// 	.then(function (res) {
// 		return res.json();
// 	})
// 	.then(function (data) {
// 		networkDataReceived = true;
// 		console.log('From web', data);
// 		updateUI(data)
// 	})

// fetch(url)
// 	.then(function (res) {
// 		console.log("res", res);
// 		isNetworkDataReceived = true
// 		return res.json();
// 	})
// 	.then(function (data) {
// 		let dataArray = []
// 		for (let key in data) {
// 			dataArray.push(data[key])
// 		}
// 		updateUI(dataArray)
// 	});

// Check if the caches supported by the browser
// if ('caches' in window) {
// 	caches.match(url)
// 	      .then(response => {
// 		      if (response) {
// 			      return response.json()
// 		      }
// 	      })
// 	      .then(data => {
// 		      // console.log("data", data);
// 		      // if (!isNetworkDataReceived) {
// 		      //     let dataArray = []
// 		      //     for (let key in data) {
// 		      //       dataArray.push(data[key])
// 		      //     }
// 		      //     console.log("dataArray", dataArray);
// 		      //     updateUI(dataArray)
// 		      // }
// 	      })
// }
