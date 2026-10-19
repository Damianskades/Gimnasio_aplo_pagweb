import { getFirestore } from "firebase/firestore";

import { aplicacion } from "./firebase";

export const db = getFirestore(aplicacion);
