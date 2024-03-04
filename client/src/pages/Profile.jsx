import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const user = currentUser?.user;

  const [file, setFile] = useState(undefined);
  const [filePercentageLoaded, setFilePercentageLoaded] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(formData);

  /**
   *   firebase storage rules
   *         allow read;
   *         allow write: if
   *           request.resource.size < 2 * 1024 * 1024 &&
   *           request.resource.contentType.matches("image/.*");
   */
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  console.log(file);
  const handleFileUpload = function (file) {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentageLoaded(Math.round(progress));
      },
      (error) => {
        console.error(error);
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((oldFormData) => ({
            ...oldFormData,
            avatar: downloadURL,
          }));
        });
        setFormData((oldFormData) => ({
          ...oldFormData,
          avatar: getDownloadURL,
        }));
      },
    );
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={formData.avatar || user.avatar}
          alt="profile image"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {fileUploadError && (
            <span className="text-red-700">Image must be less than 2mb</span>
          )}
          {filePercentageLoaded > 0 && filePercentageLoaded < 100 && (
            <span className="text-slate-700">{`uploading ${filePercentageLoaded}%`}</span>
          )}
          {filePercentageLoaded === 100 && (
            <span className="text-green-700">Avatar successfully uploaded</span>
          )}
          {filePercentageLoaded === 0 && !fileUploadError && (
            <span className="text-black-700">Click image to change avatar</span>
          )}
        </p>

        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="username">
            Username
          </label>
          <input type="text" className="border rounded-lg p-3" id="username" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="email">
            Email
          </label>
          <input type="text" className="border rounded-lg p-3" id="email" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="password">
            Password
          </label>
          <input type="text" className="border rounded-lg p-3" id="password" />
        </div>
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:bg-slate-600 opacity-95 disabled:opacity-80">
          Update profile
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
