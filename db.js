// db.js - IndexedDB implementation for offline capabilities

// Database configuration
const DB_NAME = 'squash-hub-db';
const DB_VERSION = 1;
const STORES = {
  BOOKINGS: 'bookings',
  LADDER_MEN: 'ladder_men',
  LADDER_WOMEN: 'ladder_women',
  SYNC_QUEUE: 'sync_queue'
};

// Initialize the database
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = event => {
      console.error('IndexedDB error:', event.target.error);
      reject('Error opening database');
    };
    
    request.onsuccess = event => {
      const db = event.target.result;
      console.log('Database opened successfully');
      resolve(db);
    };
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      // Create object stores
      if (!db.objectStoreNames.contains(STORES.BOOKINGS)) {
        const bookingsStore = db.createObjectStore(STORES.BOOKINGS, { keyPath: 'id', autoIncrement: true });
        bookingsStore.createIndex('date', 'date', { unique: false });
        bookingsStore.createIndex('email', 'email', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(STORES.LADDER_MEN)) {
        const menLadderStore = db.createObjectStore(STORES.LADDER_MEN, { keyPath: 'id', autoIncrement: true });
        menLadderStore.createIndex('rank', 'rank', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(STORES.LADDER_WOMEN)) {
        const womenLadderStore = db.createObjectStore(STORES.LADDER_WOMEN, { keyPath: 'id', autoIncrement: true });
        womenLadderStore.createIndex('rank', 'rank', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const syncQueueStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
        syncQueueStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// Generic function to add data to a store
function addData(storeName, data) {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      
      request.onsuccess = event => {
        console.log(`Data added to ${storeName} successfully`);
        
        // Add to sync queue if online
        if (navigator.onLine) {
          addToSyncQueue({
            action: 'add',
            store: storeName,
            data: data,
            timestamp: new Date().getTime()
          });
        }
        
        resolve(event.target.result);
      };
      
      request.onerror = event => {
        console.error(`Error adding data to ${storeName}:`, event.target.error);
        reject(event.target.error);
      };
    }).catch(error => reject(error));
  });
}

// Generic function to get all data from a store
function getAllData(storeName) {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = event => {
        resolve(event.target.result);
      };
      
      request.onerror = event => {
        console.error(`Error getting data from ${storeName}:`, event.target.error);
        reject(event.target.error);
      };
    }).catch(error => reject(error));
  });
}

// Generic function to update data in a store
function updateData(storeName, id, data) {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onsuccess = event => {
        const item = event.target.result;
        if (!item) {
          reject(`Item with id ${id} not found in ${storeName}`);
          return;
        }
        
        // Update the item with new data
        const updatedItem = { ...item, ...data };
        const updateRequest = store.put(updatedItem);
        
        updateRequest.onsuccess = event => {
          console.log(`Data updated in ${storeName} successfully`);
          
          // Add to sync queue if online
          if (navigator.onLine) {
            addToSyncQueue({
              action: 'update',
              store: storeName,
              id: id,
              data: updatedItem,
              timestamp: new Date().getTime()
            });
          }
          
          resolve(event.target.result);
        };
        
        updateRequest.onerror = event => {
          console.error(`Error updating data in ${storeName}:`, event.target.error);
          reject(event.target.error);
        };
      };
      
      request.onerror = event => {
        console.error(`Error getting data from ${storeName}:`, event.target.error);
        reject(event.target.error);
      };
    }).catch(error => reject(error));
  });
}

// Add to sync queue for later synchronization
function addToSyncQueue(syncItem) {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction(STORES.SYNC_QUEUE, 'readwrite');
      const store = transaction.objectStore(STORES.SYNC_QUEUE);
      const request = store.add(syncItem);
      
      request.onsuccess = event => {
        console.log('Item added to sync queue successfully');
        resolve(event.target.result);
      };
      
      request.onerror = event => {
        console.error('Error adding item to sync queue:', event.target.error);
        reject(event.target.error);
      };
    }).catch(error => reject(error));
  });
}

// Process sync queue when online
function processSyncQueue() {
  if (!navigator.onLine) {
    console.log('Cannot process sync queue: offline');
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction(STORES.SYNC_QUEUE, 'readwrite');
      const store = transaction.objectStore(STORES.SYNC_QUEUE);
      const request = store.getAll();
      
      request.onsuccess = event => {
        const items = event.target.result;
        
        if (items.length === 0) {
          console.log('Sync queue is empty');
          resolve();
          return;
        }
        
        console.log(`Processing ${items.length} items in sync queue`);
        
        // Process each item in the queue
        // In a real app, this would send data to a server
        const processPromises = items.map(item => {
          console.log('Processing sync item:', item);
          
          // Simulate server communication
          return new Promise(resolve => {
            setTimeout(() => {
              console.log(`Synced item: ${item.id}`);
              
              // Remove from queue after successful sync
              const deleteRequest = store.delete(item.id);
              deleteRequest.onsuccess = () => {
                console.log(`Removed item ${item.id} from sync queue`);
              };
              
              resolve();
            }, 500);
          });
        });
        
        Promise.all(processPromises)
          .then(() => {
            console.log('Sync queue processed successfully');
            resolve();
          })
          .catch(error => {
            console.error('Error processing sync queue:', error);
            reject(error);
          });
      };
      
      request.onerror = event => {
        console.error('Error getting sync queue:', event.target.error);
        reject(event.target.error);
      };
    }).catch(error => reject(error));
  });
}

// Initialize the database and populate with initial data if empty
function initializeDatabase() {
  return initDB()
    .then(() => getAllData(STORES.LADDER_MEN))
    .then(menLadder => {
      if (menLadder.length === 0) {
        // Populate with initial men's ladder data
        const initialMenLadder = [
          { name: 'John Smith', rank: 1, won: 12, lost: 3 },
          { name: 'Michael Johnson', rank: 2, won: 10, lost: 4 },
          { name: 'David Williams', rank: 3, won: 8, lost: 5 },
          { name: 'Robert Brown', rank: 4, won: 7, lost: 6 },
          { name: 'James Davis', rank: 5, won: 5, lost: 4 }
        ];
        
        return Promise.all(initialMenLadder.map(player => addData(STORES.LADDER_MEN, player)));
      }
      return Promise.resolve();
    })
    .then(() => getAllData(STORES.LADDER_WOMEN))
    .then(womenLadder => {
      if (womenLadder.length === 0) {
        // Populate with initial women's ladder data
        const initialWomenLadder = [
          { name: 'Sarah Johnson', rank: 1, won: 11, lost: 2 },
          { name: 'Emily Davis', rank: 2, won: 9, lost: 3 },
          { name: 'Jessica Wilson', rank: 3, won: 8, lost: 4 },
          { name: 'Amanda Taylor', rank: 4, won: 6, lost: 5 },
          { name: 'Olivia Martin', rank: 5, won: 4, lost: 3 }
        ];
        
        return Promise.all(initialWomenLadder.map(player => addData(STORES.LADDER_WOMEN, player)));
      }
      return Promise.resolve();
    })
    .then(() => {
      console.log('Database initialized successfully');
    })
    .catch(error => {
      console.error('Error initializing database:', error);
    });
}

// Event listeners for online/offline status
window.addEventListener('online', () => {
  console.log('App is online');
  document.body.classList.remove('offline');
  processSyncQueue();
});

window.addEventListener('offline', () => {
  console.log('App is offline');
  document.body.classList.add('offline');
});

// Export the database functions
window.db = {
  initializeDatabase,
  addBooking: data => addData(STORES.BOOKINGS, data),
  getBookings: () => getAllData(STORES.BOOKINGS),
  getMenLadder: () => getAllData(STORES.LADDER_MEN),
  getWomenLadder: () => getAllData(STORES.LADDER_WOMEN),
  addPlayerToMenLadder: data => addData(STORES.LADDER_MEN, data),
  addPlayerToWomenLadder: data => addData(STORES.LADDER_WOMEN, data),
  updateMenLadderPlayer: (id, data) => updateData(STORES.LADDER_MEN, id, data),
  updateWomenLadderPlayer: (id, data) => updateData(STORES.LADDER_WOMEN, id, data)
};
