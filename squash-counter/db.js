import { db, auth } from './firebase-config.js';
import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
  setDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { 
  signInWithEmailAndPassword,
  signOut 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Collection and document references
const countersCollection = 'counters';
const squashCounterDocId = 'squash_initiative';

/**
 * Counter data interface
 * @typedef {Object} CounterData
 * @property {number} currentCount - Current count of people introduced to squash
 * @property {number} goalCount - Goal count (1% of Dublin's population)
 * @property {Timestamp} lastUpdated - Timestamp of last update
 */

// Default counter values in case the document doesn't exist
const DEFAULT_COUNTER = {
  currentCount: 823, // Starting value for current count
  goalCount: 12991,  // 1% of Dublin's population
  lastUpdated: Timestamp.now()
};

/**
 * Retrieves the counter data from Firestore
 * @returns {Promise<CounterData>} The counter data
 */
export async function getCounterData() {
  try {
    const counterDocRef = doc(db, countersCollection, squashCounterDocId);
    const counterDoc = await getDoc(counterDocRef);
    
    // If the document exists, return its data
    if (counterDoc.exists()) {
      return counterDoc.data();
    } 
    
    // If the document doesn't exist, create it with default values
    await setDoc(counterDocRef, DEFAULT_COUNTER);
    return DEFAULT_COUNTER;
    
  } catch (error) {
    console.error('Error getting counter data:', error);
    // Return default values if there's an error
    return DEFAULT_COUNTER;
  }
}

/**
 * Updates the counter with a new count value
 * @param {number} newCount - The new count value
 * @returns {Promise<boolean>} True if the update was successful, false otherwise
 */
export async function updateCounterData(newCount) {
  try {
    if (!Number.isInteger(newCount) || newCount < 0) {
      throw new Error('Invalid count value');
    }
    
    const counterDocRef = doc(db, countersCollection, squashCounterDocId);
    
    await updateDoc(counterDocRef, {
      currentCount: newCount,
      lastUpdated: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating counter:', error);
    return false;
  }
}

/**
 * Authenticates an admin user with email and password
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<boolean>} True if login was successful, false otherwise
 */
export async function adminLogin(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    console.error('Login error:', error.message);
    return false;
  }
}

/**
 * Logs out the current admin user
 * @returns {Promise<boolean>} True if logout was successful, false otherwise
 */
export async function adminLogout() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Logout error:', error.message);
    return false;
  }
}

/**
 * Checks if the user is currently logged in
 * @returns {boolean} True if user is logged in, false otherwise
 */
export function isAdminLoggedIn() {
  return auth.currentUser !== null;
}