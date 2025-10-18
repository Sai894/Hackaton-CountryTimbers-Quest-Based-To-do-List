
//exportable function to calculate the user's title based on XP
export function calculateTitle(xp){
    if (xp >= 1000) return "Legendary Hero";
    if (xp >= 300) return "Honorable Knight";
    if (xp >= 100) return "Noble Squire";
    return "Novice Adventurer";
}

export async function signInWithGoogle() {
    const { signInPopup } = window.firebaseModules;
    const auth = window.firebaseAuth
    const provider = window.googleProvider

    try {
        const response = await signInPopup(auth, provider);
        return response.user;
    }catch(err) {
        console.error("error signing in: ", err);
        alert("Failed to log in, please try again.");
    }
}

export async function signOut() {
    const {signOut } = window.firebaseModules;
    const auth = window.firebaseAuth

    try{
        await signOut(auth);
    } catch (error) {
        console.error("error signing out: ", error);
    }
}

export async function createUser(userId, userData){
    const { doc, getDoc, setDoc, serverTimestamp } = window.firebaseModules;
    const db = window.firebaseDb

    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);

    //Creates new user if non-existent
    if(!userSnapshot.exists()){
        await setDoc(userRef, {
                name: userData.displayName || "Adventurer",
            email: userData.email,
            coins: 0,
            xp: 0,
            title: "Novice Adventurer",
            createdAt: serverTimestamp()
            });
    }

    return await getUserData(userId);
}

//Getter
export async function getUserData(userId){
    const { doc, getDoc } = window.firebaseModules;
    const db = window.firebaseDb

    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);

    return userSnapshot.exists() ? { id: userSnapshot.id, ...userSnapshot.data() } : null;
}
