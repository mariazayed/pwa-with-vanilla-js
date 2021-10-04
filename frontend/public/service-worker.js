importScripts("/src/js/helpers/idb.js");
importScripts("/src/js/utility.js");
importScripts("/src/js/api.js");

var CACHE_STATIC_NAME = "static-v22";
var CACHE_DYNAMIC_NAME = "dynamic-v2";
var STATIC_FILES = [
	"/",
	"/index.html",
	"/offline.html",
	"/src/js/app.js",
	"/src/js/feed.js",
	"/src/js/helpers/idb.js",
	"/src/js/helpers/promise.js",
	"/src/js/helpers/fetch.js",
	"/src/js/helpers/material.min.js",
	"/src/css/app.css",
	"/src/css/feed.css",
	"/src/images/main-image.jpg",
	"https://fonts.googleapis.com/css?family=Roboto:400,700",
	"https://fonts.googleapis.com/icon?family=Material+Icons",
	"https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css"
];

// function trimCache(cacheName, maxItems) {
//   caches.open(cacheName)
//     .then(function (cache) {
//       return cache.keys()
//         .then(function (keys) {
//           if (keys.length > maxItems) {
//             cache.delete(keys[0])
//               .then(trimCache(cacheName, maxItems));
//           }
//         });
//     })
// }

self.addEventListener("install", function (event) {
	// console.log('[Service Worker] Installing Service Worker ...', event);
	event.waitUntil(
		caches.open(CACHE_STATIC_NAME)
		      .then(function (cache) {
			      // console.log('[Service Worker] Precaching App Shell');
			      cache.addAll(STATIC_FILES);
		      })
	);
});

self.addEventListener("activate", function (event) {
	// console.log('[Service Worker] Activating Service Worker ....', event);
	event.waitUntil(
		caches.keys()
		      .then(function (keyList) {
			      return Promise.all(keyList.map(function (key) {
				      if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
					      // console.log('[Service Worker] Removing old cache.', key);
					      return caches.delete(key);
				      }
			      }));
		      })
	);
	return self.clients.claim();
});

function isInArray(string, array) {
	var cachePath;
	if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
		// console.log('matched ', string);
		cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
	} else {
		cachePath = string; // store the full request (for CDNs)
	}
	return array.indexOf(cachePath) > -1;
}

self.addEventListener("fetch", function (event) {

	const url = "http://localhost:3000/post";
	if (event.request.url.indexOf(url) > -1) {
		event.respondWith(fetch(event.request)
			                  .then(function (res) {
				                  var clonedRes = res.clone();
				                  clearAllData("posts")
					                  .then(function () {
						                  return clonedRes.json();
					                  })
					                  .then(function (data) {
						                  for (var key in data) {
							                  writeData("posts", data[key]);
						                  }
					                  });
				                  return res;
			                  })
		);
	} else if (isInArray(event.request.url, STATIC_FILES)) {
		event.respondWith(
			caches.match(event.request)
		);
	} else {
		event.respondWith(
			caches.match(event.request)
			      .then(function (response) {
				      if (response) {
					      return response;
				      } else {
					      return fetch(event.request)
						      .then(function (res) {
							      return caches.open(CACHE_DYNAMIC_NAME)
							                   .then(function (cache) {
								                   // trimCache(CACHE_DYNAMIC_NAME, 3);
								                   // cache.put(event.request.url, res.clone());
								                   return res;
							                   });
						      })
						      .catch(function (err) {
							      return caches.open(CACHE_STATIC_NAME)
							                   .then(function (cache) {
								                   if (event.request.headers.get("accept").includes("text/html")) {
									                   return cache.match("/offline.html");
								                   }
							                   });
						      });
				      }
			      })
		);
	}
});

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         if (response) {
//           return response;
//         } else {
//           return fetch(event.request)
//             .then(function(res) {
//               return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//             })
//             .catch(function(err) {
//               return caches.open(CACHE_STATIC_NAME)
//                 .then(function(cache) {
//                   return cache.match('/offline.html');
//                 });
//             });
//         }
//       })
//   );
// });

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function(res) {
//         return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//       })
//       .catch(function(err) {
//         return caches.match(event.request);
//       })
//   );
// });

// Cache-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//   );
// });

// Network-only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//   );
// });

self.addEventListener("sync", (event) => {
	console.log("BG SYNC");

	if (event.tag === "sync-new-posts") {
		event.waitUntil(
			readAllData("sync-posts")
				.then(data => {
					for (const dataObj of data) {
						const tempData = {
							id: dataObj.id,
							title: dataObj.title,
							location: dataObj.location,
							image: "/src/images/icons/sf-boat.png"
						};

						insertToDb(tempData).then((res) => {
							// console.log("res", res);
							// Cleaning the data from the iDB
							if (res) {
								deleteItemFromData("sync-posts", tempData.id);
							}
						});
					}
				})
				.catch(err => {
					console.log("Error while sending data", err);
				})
		);
	}
});

self.addEventListener("notificationclick", (event) => {
	const notification = event.notification;
	const action = event.action;

	if (action === "confirm") {
		console.log("Confirm chosen");
	} else {
		console.log("ACTION", action);
	}
	notification.close();
});

self.addEventListener("notificationclose", (event) => {
	console.log("Notification was closed", event);
});
