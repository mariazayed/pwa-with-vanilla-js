importScripts('/src/js/idb.js')
importScripts('/src/utility.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js')

const CACHE_STATIC_NAME = 'static-v2'
const CACHE_DYNAMIC_NAME = 'dynamic-v2'
const STATIC_FILES = ['/',
                      '/index.html',
                      '/offline.html',
                      '/src/app.js',
                      '/src/js/idb.js',
                      '/src/js/promise.js',
                      '/src/js/fetch.js',
                      '/src/js/material.min.js',
                      '/src/css/app.css',
                      'https://fonts.googleapis.com/css?family=Roboto:400,700',
                      'https://fonts.googleapis.com/icon?family=Material+Icons',
                      'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
]

const firebaseConfig = {
	apiKey: "AIzaSyC2l_vkZzvYTMMTE1tFI_6aYg03rSpaPz0",
	authDomain: "pwa-vanilla-js.firebaseapp.com",
	projectId: "pwa-vanilla-js",
	storageBucket: "pwa-vanilla-js.appspot.com",
	messagingSenderId: "800674186660",
	appId: "1:800674186660:web:f1922ee22922814e916d31"
};

// Use case: if the cache items exceeded the maximum, delete the oldest cached items
function deleteCache(cacheName, maxItems) {
	caches.open(cacheName)
	      .then(cache => {
		      return cache.keys()
		                  .then(keys => {
			                  if (keys.length > maxItems) {
				                  caches.delete(keys[0])
				                        .then(deleteCache(cacheName, maxItems))
			                  }
		                  })
	      })
}

// Cache static links/files
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_STATIC_NAME)
		      .then((cache) => {
			      console.log("Caching static links/files...");
			      cache.addAll(STATIC_FILES)
		      })
		      .catch(error => {
			      console.log("Error from static cache");
		      })
	)
})

// Cleaning/removing caches (except for the needed one(s))
self.addEventListener('activate', (event) => {
	event.waitUntil
	     (
		     caches.keys()
		           .then(keys => {
			           return Promise.all(keys.map((key) => {
				           if (key !== CACHE_DYNAMIC_NAME) {
					           console.log("Removing old cache", key);
					           return caches.delete(key)
				           }
			           }))
		           })
	     )
	return self.clients.claim()
})

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()
const colRef = db.collection('posts')
const postsSnapshot = colRef.get();
postsSnapshot
	.then(res => {
		isNetworkDataReceived = true
		const postsList = res.docs.map(res1 => res1.data());
		console.log("postsList", postsList);
		// updateUI(postsList)

		// const clonedRes = res.clone()
		clearAllData('posts')
			.then(() => {
				return res.json()
			})
			.then(data => {
				for (const key in data) {
					writeData('posts', data[key])
					// .then(() => {
					// deleteItemFromIndexedDB('posts', key)
					// })
				}
			})
		return res
	})
	.catch(err => {
		console.log("err", err);
	})

// With indexed DB
// self.addEventListener('fetch', (event) => {
// 	// Replace the URL with the DB URL
// 	const url = 'https://httpbin.org/get'
//
// 	if (event.request.url.indexOf(url) > -1) {
// 		event.respondWith(
// 			fetch(event.request)
// 				.then(res => {
// 					const clonedRes = res.clone()
// 					clearAllData('posts')
// 						.then(() => {
// 							return clonedRes.json()
// 						})
// 						.then(data => {
// 							for (const key in data) {
// 								writeData('posts', data[key])
// 									.then(() => {
// 										// deleteItemFromIndexedDB('posts', key)
// 									})
// 							}
// 						})
// 					return res
// 				})
// 		)
// 	} else if (isInArray(event.request, STATIC_FILES)) {
// 		// Cache-only strategy
// 		event.respondWith(caches.match(event.request))
// 	} else {
// 		event.respondWith(
// 			caches.match(event.request)
// 			      .then((response) => {
// 				      if (response) {
// 					      return response
// 				      } else {
// 					      return fetch(event.request)
// 						      .then(res => {
// 							      return caches.open('dynamic')
// 							                   .then(cache => {
// 								                   // cache.put(event.request.url, res.clone())
// 								                   return res
// 							                   })
// 							                   .catch()
// 						      })
// 						      .catch(error => {
// 							      return caches.open(CACHE_STATIC_NAME)
// 							                   .then(cache => {
// 								                   if (event.request.headers.get('accept').includes('text/html')) {
// 									                   return cache.match('/offline.html')
// 								                   }
// 							                   })
// 						      })
// 				      }
// 			      })
// 			      .catch()
// 		)
// 	}
// })

// With cache
// self.addEventListener('fetch', (event) => {
// 	const url = 'https://httpbin.org/get'
//
// 	if (event.request.url.indexOf(url) > -1) {
// 		event.respondWith(
// 			caches.open(CACHE_DYNAMIC_NAME)
// 			      .then(cache => {
// 				      return fetch(event.request)
// 					      .then(res => {
// 						      cache.put(event.request, res.clone())
// 						      return res
// 					      })
// 			      })
// 		)
// 	} else if (isInArray(event.request, STATIC_FILES)) {
// 		// Cache-only strategy
// 		event.respondWith(caches.match(event.request))
// 	} else {
// 		event.respondWith(
// 			caches.match(event.request)
// 			      .then((response) => {
// 				      if (response) {
// 					      return response
// 				      } else {
// 					      return fetch(event.request)
// 						      .then(res => {
// 							      return caches.open('dynamic')
// 							                   .then(cache => {
// 								                   cache.put(event.request.url, res.clone())
// 								                   return res
// 							                   })
// 							                   .catch()
// 						      })
// 						      .catch(error => {
// 							      return caches.open(CACHE_STATIC_NAME)
// 							                   .then(cache => {
// 								                   if (event.request.headers.get('accept').includes('text/html')) {
// 									                   return cache.match('/offline.html')
// 								                   }
// 							                   })
// 						      })
// 				      }
// 			      })
// 			      .catch()
// 		)
// 	}
// })

function isInArray(str, array) {
	let cachePath;

	// Request targets domain where we serve the page from (i.e. NOT a CDN)
	if (str.toString().indexOf(self.origin) === 0) {
		// Take the part of the URL AFTER the domain (e.g. after localhost:8080)
		cachePath = str.substring(self.origin.length);
	} else {
		// Store the full request (for CDNs)
		cachePath = str;
	}
	return array.indexOf(cachePath) > -1;
}
