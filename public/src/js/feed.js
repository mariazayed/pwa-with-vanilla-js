const shareImageButton = document.querySelector('#share-image-button');
const createPostArea = document.querySelector('#create-post');
const closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
const sharedMomentsArea = document.querySelector('#shared-moments');

let networkDataReceived = false;

function openCreatePostModal() {
	// createPostArea.style.display = 'block';
	// setTimeout(function() {
	createPostArea.style.transform = 'translateY(0)';
	// }, 1);
	if (deferredPrompt) {
		deferredPrompt.prompt();

		deferredPrompt.userChoice.then(function (choiceResult) {
			// console.log(choiceResult.outcome);

			if (choiceResult.outcome === 'dismissed') {
				console.log('User cancelled installation');
			} else {
				console.log('User added to home screen');
			}
		});

		deferredPrompt = null;
	}

	// if ('serviceWorker' in navigator) {
	//   navigator.serviceWorker.getRegistrations()
	//     .then(function(registrations) {
	//       for (const i = 0; i < registrations.length; i++) {
	//         registrations[i].unregister();
	//       }
	//     })
	// }
}

function closeCreatePostModal() {
	createPostArea.style.transform = 'translateY(100vh)';
	// createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// Currently not in use, allows to save assets in cache on demand otherwise
function onSaveButtonClicked(event) {
	// console.log('clicked');
	if ('caches' in window) {
		caches.open('user-requested')
		      .then(function (cache) {
			      cache.add('https://httpbin.org/get');
			      cache.add('/src/images/sf-boat.jpg');
		      });
	}
}

function clearCards() {
	while (sharedMomentsArea.hasChildNodes()) {
		sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
	}
}

function createCard(data) {
	const cardWrapper = document.createElement('div');
	cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
	const cardTitle = document.createElement('div');
	cardTitle.className = 'mdl-card__title';
	cardTitle.style.backgroundImage = 'url(' + data.image + ')';
	cardTitle.style.backgroundSize = 'cover';
	cardWrapper.appendChild(cardTitle);
	const cardTitleTextElement = document.createElement('h2');
	cardTitleTextElement.style.color = 'white';
	cardTitleTextElement.className = 'mdl-card__title-text';
	cardTitleTextElement.textContent = data.title;
	cardTitle.appendChild(cardTitleTextElement);
	const cardSupportingText = document.createElement('div');
	cardSupportingText.className = 'mdl-card__supporting-text';
	cardSupportingText.textContent = data.location;
	cardSupportingText.style.textAlign = 'center';
	// const cardSaveButton = document.createElement('button');
	// cardSaveButton.textContent = 'Save';
	// cardSaveButton.addEventListener('click', onSaveButtonClicked);
	// cardSupportingText.appendChild(cardSaveButton);
	cardWrapper.appendChild(cardSupportingText);
	componentHandler.upgradeElement(cardWrapper);
	sharedMomentsArea.appendChild(cardWrapper);
}

function updateUI(data) {
	clearCards();
	for (let i = 0; i < data.length; i++) {
		createCard(data[i]);
	}
}

// Firebase initialization
initFirebase()
const postsList = getPosts()
postsList.then(posts => {
	// console.log("posts in app.js", posts);
	updateUI(posts)
	for (const key in posts) {
		writeData('posts', posts[key])
	}

})
// const url = 'https://pwagram-99adf.firebaseio.com/posts.json';
// let networkDataReceived = false;
//
// fetch(url)
//   .then(function(res) {
//     return res.json();
//   })
//   .then(function(data) {
//     networkDataReceived = true;
//     console.log('From web', data);
//     const dataArray = [];
//     for (const key in data) {
//       dataArray.push(data[key]);
//     }
//     updateUI(dataArray);
//   });

if ('indexedDB' in window) {
	readAllData('posts')
		.then(function (data) {
			if (!networkDataReceived) {
				// console.log('From cache', data);
				updateUI(data);
			}
		});
}
