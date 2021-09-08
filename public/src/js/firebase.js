const firebaseConfig = {
	apiKey: "AIzaSyC2l_vkZzvYTMMTE1tFI_6aYg03rSpaPz0",
	authDomain: "pwa-vanilla-js.firebaseapp.com",
	projectId: "pwa-vanilla-js",
	storageBucket: "pwa-vanilla-js.appspot.com",
	messagingSenderId: "800674186660",
	appId: "1:800674186660:web:f1922ee22922814e916d31"
};

function initFirebase() {
	firebase.initializeApp(firebaseConfig);
}

function getPosts() {
	const db = firebase.firestore()
	const colRef = db.collection('posts')
	const postsSnapshot = colRef.get();
	return postsSnapshot.then(res => {
		                    // isNetworkDataReceived = true
		                    const postsList = res.docs.map(res1 => res1.data());
		                    // console.log("postsList", postsList);
		                    return postsList
	                    })
	                    .catch(err => {
		                    console.log("err", err);
	                    })
}
