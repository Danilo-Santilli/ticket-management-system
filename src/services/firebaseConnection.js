import { initializeApp} from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAd9mDI41vh6c0I9r0fxULFd6Ah0UdqEGQ",
    authDomain: "sistema-chamados-a57eb.firebaseapp.com",
    projectId: "sistema-chamados-a57eb",
    storageBucket: "sistema-chamados-a57eb.appspot.com",
    messagingSenderId: "647144888637",
    appId: "1:647144888637:web:0112adfe4bab38f9fc8d54",
    measurementId: "G-XCW0Y2X8ZG"
  };

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };