import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "firebaseConfig";

const updateTweetFromFirebase = async (docId, changeObj) => {
  await dbService.doc(`tweets/${docId}`).update(changeObj);
};

const removeFileFromStorage = async (url) => {
  if (url !== "") {
    try {
      await storageService.refFromURL(url).delete();
    } catch (error) {
      console.error(error);
    }
  }
};

const uploadFileToStorage = async (userId, data) => {
  let photoURL = "";
  if (data !== "") {
    const photoRef = storageService.ref().child(`${userId}/${uuidv4()}`);
    const response = await photoRef.putString(data, "data_url");
    photoURL = await response.ref.getDownloadURL();
  }

  return photoURL;
};

const readFile = (fileEvent, onload) => {
  const {
    target: { files },
  } = fileEvent;

  const file = files[0];
  const reader = new FileReader();
  reader.onloadend = onload;
  reader.readAsDataURL(file);
};

export {
  updateTweetFromFirebase,
  removeFileFromStorage,
  uploadFileToStorage,
  readFile,
};
