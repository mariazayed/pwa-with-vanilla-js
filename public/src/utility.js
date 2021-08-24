const dbPromise = idb.open('posts-store', 1, function (db) {
	if (!db.objectStoreNames.contains('posts')) {
		db.createObjectStore('posts', {
			keyPath: 'id'
		})
	}
})

function writeData(store, data) {
	return dbPromise.then(db => {
		const tx = db.transaction(store, 'readwrite')
		const store = tx.objectStore(store)
		store.put(data)
		return tx.complete
	})
}
