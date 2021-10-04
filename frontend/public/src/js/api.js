const url = "http://localhost:3000/post";

function getPosts() {
	return fetch(url)
		.then(function (res) {
			console.log("response from get", res);
			return res.json();
		})
		// .then(function (data) {
		// 	console.log("data", data);
		// });
}

async function insertToDb(data) {
	// console.log("data", data);
	const rawResponse = await fetch(url, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	const response = await rawResponse.json();
	console.log("responseFromPost", response);
}
