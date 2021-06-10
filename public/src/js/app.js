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


var sharedMomentsArea = document.querySelector('#shared-moments');

function createCard() {
	var cardWrapper = document.createElement('div');
	cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
	var cardTitle = document.createElement('div');
	cardTitle.className = 'mdl-card__title';
	cardTitle.style.backgroundImage = 'url("/src/images/sf-boat.jpg")';
	cardTitle.style.backgroundSize = 'cover';
	cardTitle.style.height = '180px';
	cardWrapper.appendChild(cardTitle);
	var cardTitleTextElement = document.createElement('h2');
	cardTitleTextElement.className = 'mdl-card__title-text';
	cardTitleTextElement.textContent = 'San Francisco Trip';
	cardTitle.appendChild(cardTitleTextElement);
	var cardSupportingText = document.createElement('div');
	cardSupportingText.className = 'mdl-card__supporting-text';
	cardSupportingText.textContent = 'In San Francisco';
	cardSupportingText.style.textAlign = 'center';
	cardWrapper.appendChild(cardSupportingText);
	componentHandler.upgradeElement(cardWrapper);
	sharedMomentsArea.appendChild(cardWrapper);
}

fetch('https://httpbin.org/get')
	.then(function (res) {
		return res.json();
	})
	.then(function (data) {
		createCard();
	});
