// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, getDoc, doc, addDoc, DocumentSnapshot, updateDoc } from "firebase/firestore";
import { mazeDataToMazeDocument } from "./lib";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Collection references
export const mazesCollection = collection(db, "mazes");

// Get a list of mazes
export const getMazes = getDocs(mazesCollection)
    .then(querySnapshot => {
        let mazes = [];
        querySnapshot.docs.forEach((doc) => {
            mazes.push({ ...doc.data(), id: doc.id });
        })
    })
    .catch(error => {
        console.log(error);
    })

// Get a single maze
export const getMaze = (id: string) => {
    const docRef = doc(db, "mazes", id);
    return getDoc(docRef)
        .then(docSnapshot => {
            return { ...docSnapshot.data(), id: docSnapshot.id } as MazeDocument;
        })
        .catch(error => {
            console.log(error);
            return null
        })

}

export const submitNewMaze = (mazeData: MazeData): Promise<string> => {

    const newMazeDocument = mazeDataToMazeDocument(mazeData);
    const droppingId = {
        squares: newMazeDocument.squares,
        size: newMazeDocument.size
    }

    return addDoc(mazesCollection, droppingId)
        .then(docRef => {
            return docRef.id
        })
        .catch(error => {
            console.log(error);
            return ""
        })

}

export const updateMaze = (maze: MazeDocument): Promise<void> => {
    const docRef = doc(db, "mazes", maze.id);
    return updateDoc(docRef, maze)
}