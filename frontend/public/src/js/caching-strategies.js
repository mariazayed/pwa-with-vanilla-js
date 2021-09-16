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
