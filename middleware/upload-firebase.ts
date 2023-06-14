import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import config from "../database/firebase.config";

initializeApp(config.firebaseConfig);
const firebaseStorage = getStorage()

// multer
// const storage = multer.memoryStorage();

// // multer
// export const upload = multer({storage})


export const uploadFirebase = async (file: any) => {
  // const storageRef = ref(firebaseStorage, file.originalname);
  // const file = req.file;
  if(!file) return null;

  const storageRef = ref(firebaseStorage, `files/${file.originalname}+${Date.now()}`);
  // const uploadTask = uploadBytesResumable(storageRef, file);

  const metadata = {
    contentType: file.mimetype,
  }

  const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);

  const url = await getDownloadURL(snapshot.ref);

  return url;
};

// export default uploadFirebase;
