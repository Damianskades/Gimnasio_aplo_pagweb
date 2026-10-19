import { getAuth } from "firebase/auth";

import { aplicacion } from "./firebase";

export const auth = getAuth(aplicacion);

auth.languageCode = "es";
