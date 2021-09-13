const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.storePostData = functions.https.onRequest((request, response) => {
	// functions.logger.info("Hello logs!", {structuredData: true});
	// response.send("Hello from Firebase!");

	cors((request, response) => {
		admin.database().ref("posts").push({
			                                   id: response.body.id,
			                                   title: request.body.title,
			                                   location: request.body.location,
			                                   image: request.body.image
		                                   })
		     .then(() => {
			     response.status(201).json({
				                               message: "Data Stored!",
				                               id: request.body.id
			                               });
		     })
		     .catch(error => {
			     response.status(500).json({error});
		     });
	});
});
