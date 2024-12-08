import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
        await setPersistence(auth, browserLocalPersistence);
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error logging in with Google: ", errorCode, errorMessage);
        throw new Error(errorCode).message;
    }
};


const signInWithEmailPassword = async (email, password) => {
    const auth = getAuth();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('userCredential: ', userCredential);
        return userCredential.user;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error logging in with email and password: ", errorCode, errorMessage);
        throw new Error(`${errorCode}: ${errorMessage}`);

       // throw new Error(errorCode).message;
    }
};

const resetPassword = async (email) => {
    const auth = getAuth();
    try {
        await sendPasswordResetEmail(auth, email);
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

export { signInWithGoogle, signInWithEmailPassword, resetPassword };
