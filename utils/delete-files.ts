

import { deleteObject, ref } from "firebase/storage";
import { firebaseStorage } from "../database/storage";

// }
export const deleteFiles = async (url: string) => {
  if(!url) return null;
  const desertRef = ref(firebaseStorage, url );

  // Delete the file
  await deleteObject(desertRef)
    .then(() => {
      // File deleted successfully
      console.log("File deleted successfully");
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
      console.log(error);
    });
};
