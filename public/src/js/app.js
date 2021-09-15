let deferredPrompt;
let enableNotificationButtons = document.querySelectorAll(".enable-notifications");

if (!window.Promise) {
	window.Promise = Promise;
}

if ("serviceWorker" in navigator) {
	navigator.serviceWorker
	         .register("/service-worker.js")
	         .then(function () {
		         // console.log('Service worker registered!');
	         })
	         .catch(function (err) {
		         // console.log(err);
	         });
}

if ("Notification" in window) {
	for (let i = 0; i < enableNotificationButtons.length; i++) {
		enableNotificationButtons[i].style.display = "inline-block";
		enableNotificationButtons[i].addEventListener("click", askForNotificationPermission);
	}
}

window.addEventListener("beforeinstallprompt", function (event) {
	// console.log('beforeinstallprompt fired');
	event.preventDefault();
	deferredPrompt = event;
	return false;
});

function askForNotificationPermission() {
	// Push + Notification permission
	Notification.requestPermission(result => {
		console.log("User choice", result);
		if (result !== "granted") {
			console.log("No notification permission granted");
		} else {
			// displayConfirmNotification();
			configurePushSub();
		}
	});
}

function configurePushSub() {
	if (!("serviceworker" in navigator)) {
		return;
	}

	let swReg;

	navigator.serviceworker.ready
	         .then((sw) => {
		         swReg = sw;
		         return sw.pushManager.getSubscription();
	         })
	         .then((sub) => {
		         if (sub === null) {
			         // Create new subscription
			         swReg.pushManager.subscribe({
				                                     userVisibleOnly: true
			                                     });
		         } else {

		         }
	         });
}

function displayConfirmNotification() {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.ready
			// Active service worker
			     .then((sw) => {
				     const options = {
					     body: "You successfully subscribed to our notification service",
					     icon: "/src/images/icons/app-icon-96x96.png",
					     image: "/src/images/icons/sf-boat.png",
					     dir: "ltr",
					     lang: "en-US", // BCP 47
					     vibrate: [100, 50, 2000],
					     badge: "/src/images/icons/app-icon-96x96.png",
					     tag: "confirm-notification",
					     renotify: true,
					     actions: [
						     {
							     action: "confirm",
							     title: "Okay",
							     icon: "/src/images/icons/app-icon-96x96.png"
						     },
						     {
							     action: "cancel",
							     title: "Cancel",
							     icon: "/src/images/icons/app-icon-96x96.png"
						     },
					     ]
				     };
				     sw.showNotification("Successfully Subscribed (from SW)!", options);
			     });
	}

	// Without using the service workers
	// const options = {
	// 	body: "You successfully subscribed to our notification service"
	// };
	//
	// new Notification("Successfully Subscribed!", options);
}
