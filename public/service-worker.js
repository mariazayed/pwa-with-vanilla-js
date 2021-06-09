self.addEventListener('install', (event) => {
	// console.log("Installing service worker", event)
})

self.addEventListener('activate', (event) => {
	// console.log("Activating service worker", event)
	return self.clients.claim()
})

self.addEventListener('fetch', (event) => {
	// console.log("Fetching something", event)
	event.respondWith(fetch(event.request))
})
