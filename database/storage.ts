import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "@firebase/storage";

import { initializeApp } from "@firebase/app";

import config from "../database/firebase.config";

initializeApp(config.firebaseConfig);

export const firebaseStorage = getStorage();

