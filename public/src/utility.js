const dbPromise = idb.open('posts', 1, function (db) {
	if (!db.objectStoreNames.contains('posts')) {
		db.createObjectStore('posts', {
			keyPath: 'id'
		})
	}
})

function writeData(store, data) {
	return dbPromise.then(db => {
		const tx = db.transaction(store, 'readwrite')
		const st = tx.objectStore(store)
		st.put(data)
		return tx.complete
	})
}

function readAllData(store) {
	return dbPromise
		.then((db) => {
			const tx = db.transaction(store, 'readonly')
			const st = tx.objectStore(store)
			return st.getAll()
		})
}

function clearAllData(store) {
	return dbPromise
		.then(db => {
			const tx = db.transaction(store, 'readwrite')
			const st = tx.objectStore(store)
			st.clear()
			return tx.complete;
		})
}

function deleteItemFromIndexedDB(store, id) {
	return dbPromise
		.then(db => {
			const tx = db.transaction(store, 'readwrite')
			const st = tx.objectStore(store)
			st.delete(id)
			return tx.complete
		})
		.then(() => {
			console.log("Item deleted");
		})
}
