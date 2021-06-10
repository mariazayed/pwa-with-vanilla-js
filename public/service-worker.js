self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open('static')
		      .then((cache) => {
			      console.log("Precaching app shell");
			      cache.addAll(['/',
			                    '/index.html',
			                    '/src/js/app.js',
			                    '/src/js/extra/promise.js',
			                    '/src/js/extra/fetch.js',
			                    '/src/js/extra/material.min.js',
			                    '/src/css/app.css',
			                    'https://fonts.googleapis.com/css?family=Roboto:400,700',
			                    'https://fonts.googleapis.com/icon?family=Material+Icons',
			                    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'])
		      })
		      .catch()
	)
})

self.addEventListener('activate', (event) => {
	return self.clients.claim()
})

self.addEventListener('fetch', (event) => {
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
					      .catch()
			      }
		      })
		      .catch()
	)
})
