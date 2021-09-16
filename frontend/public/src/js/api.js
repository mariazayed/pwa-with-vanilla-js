const url = "http://localhost:3000/";

function getPosts() {
	fetch(url)
		.then(function (res) {
			return res.json();
		})
		.then(function (data) {
			console.log("data", data);
		});
}

function insertToDb(data) {
	return firebase.firestore()
	               .collection("posts")
	               .add(data);
}
