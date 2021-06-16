const CACHE_STATIC_NAME = 'static-v2'
const CACHE_DYNAMIC_NAME = 'dynamic-v2'
const STATIC_FILES = ['/',
                      '/index.html',
                      '/offline.html',
                      '/src/js/app.js',
                      '/src/js/extra/promise.js',
                      '/src/js/extra/fetch.js',
                      '/src/js/extra/material.min.js',
                      '/src/css/app.css',
                      'https://fonts.googleapis.com/css?family=Roboto:400,700',
                      'https://fonts.googleapis.com/icon?family=Material+Icons',
                      'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css']

function trimCache(cacheName, maxItems) {
	caches.open(cacheName)
	      .then(cache => {
		      return cache.keys()
		                  .then(keys => {
			                  if (keys.length > maxItems) {
				                  caches.delete(keys[0])
				                        .then(trimCache(cacheName, maxItems))
			                  }
		                  })
	      })
}

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_STATIC_NAME)
		      .then((cache) => {
			      console.log("Precaching app shell");
			      cache.addAll(STATIC_FILES)
		      })
		      .catch()
	)
})

self.addEventListener('activate', (event) => {
	event.waitUntil
	     (
		     caches.keys()
		           .then(keys => {
			           return Promise.all(keys.map((key) => {
				           if (key !== CACHE_DYNAMIC_NAME) {
					           // console.log("Removing old cache", key);
					           // return caches.delete(key)
				           }
			           }))
		           })
	     )
	return self.clients.claim()
})

function isInArray(str, array) {
	let cachePath;
	if (str.toString().indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
		console.log('matched ', str);
		cachePath = str.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
	} else {
		cachePath = str; // store the full request (for CDNs)
	}
	return array.indexOf(cachePath) > -1;
}

self.addEventListener('fetch', (event) => {
	const url = 'https://httpbin.org/get'

	if (event.request.url.indexOf(url) > -1) {
		event.respondWith(
			caches.open(CACHE_DYNAMIC_NAME)
			      .then(cache => {
				      return fetch(event.request)
					      .then(res => {
						      trimCache(CACHE_DYNAMIC_NAME, 3)
						      cache.put(event.request, res.clone())
						      return res
					      })
			      })
		)
	} else if (isInArray(event.request, STATIC_FILES)) {
		// Cache-only strategy
		event.respondWith(caches.match(event.request))
	} else {
		event.respondWith(
			caches.match(event.request)
			      .then((response) => {
				      if (response) {
					      return response
				      } else {
					      return fetch(event.request)
						      .then(res => {
							      return caches.open('dynamic')
							                   .then(cache => {
								                   cache.put(event.request.url, res.clone())
								                   return res
							                   })
							                   .catch()
						      })
						      .catch(error => {
							      return caches.open(CACHE_STATIC_NAME)
							                   .then(cache => {
								                   if (event.request.headers.get('accept').includes('text/html')) {
									                   return cache.match('/offline.html')
								                   }
							                   })
						      })
				      }
			      })
			      .catch()
		)
	}
})

// Cache with network fallback strategy
// self.addEventListener('fetch', (event) => {
// 	event.respondWith(
// 		caches.match(event.request)
// 		      .then((response) => {
// 			      if (response) {
// 				      return response
// 			      } else {
// 				      return fetch(event.request)
// 					      .then(res => {
// 						      return caches.open('dynamic')
// 						                   .then(cache => {
// 							                   cache.put(event.request.url, res.clone())
// 							                   return res
// 						                   })
// 						                   .catch()
// 					      })
// 					      .catch(error => {
// 						      return caches.open(CACHE_STATIC_NAME)
// 						                   .then(cache => {
// 							                   return cache.match('/offline.html')
// 						                   })
// 					      })
// 			      }
// 		      })
// 		      .catch()
// 	)
// })

// Network with cache fallback strategy
// self.addEventListener('fetch', (event) => {
// 	event.respondWith(
// 		fetch(event.request)
// 			.then(response => {
// 				return caches.open('dynamic')
// 				             .then(cache => {
// 					             cache.put(event.request.url, response.clone())
// 					             return response
// 				             })
// 				             .catch()
// 			})
// 			.catch(error => {
// 				return caches.match(event.request)
// 			})
// 	)
// })

// Cache-only strategy
// self.addEventListener('fetch', (event) => {
// 	event.respondWith(caches.match(event.request))
// })

// Network-only strategy
// self.addEventListener('fetch', (event) => {
// 	event.respondWith(event.request)
// })
