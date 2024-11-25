import AuthContext from "@/components/context/AuthContext";
import PostHeader from "@/components/posts/Header";
import { storage } from "@/firebaseApp";
import { updateProfile } from "firebase/auth";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function ProfileEditPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e?.target?.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = (e) => {
        const { result } = e.currentTarget as FileReader;
        setImageUrl(result as string);
      };
    }
  };

  const handleDeleteImage = () => {
    setImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    let newImageUrl = null;

    try {
      // 기존 이미지 삭제
      if (user?.photoURL) {
        const imageRef = ref(storage, user?.photoURL);
        await deleteObject(imageRef).catch((error) => {
          console.log(error);
        });
      }
      // 이미지 업로드
      if (imageUrl) {
        const uploadTask = await uploadString(storageRef, imageUrl, "data_url");
        newImageUrl = await getDownloadURL(uploadTask.ref);
      }
      // updateProfile 호출
      if (user) {
        await updateProfile(user, {
          displayName: displayName || "",
          photoURL: newImageUrl || "",
        })
          .then(() => {
            toast.success("프로필이 수정되었습니다.");
            navigate("/profile");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.photoURL) {
      setImageUrl(user?.photoURL);
    }

    if (user?.displayName) {
      setDisplayName(user?.displayName);
    }
  }, [user?.displayName, user?.photoURL]);

  return (
    <div className="post">
      <PostHeader />
      <form className="post-form" onSubmit={handleSubmit}>
        <div className="post-form__profile">
          <input
            type="text"
            name="displayName"
            className="post-form__input"
            placeholder="이름"
            value={displayName}
            onChange={onChange}
          />
          {imageUrl && (
            <div className="post-form__attachment">
              <img src={imageUrl} alt="attachment" width={100} height={100} />
              <button
                type="button"
                className="post-form__clear-btn"
                onClick={handleDeleteImage}
              >
                clear
              </button>
            </div>
          )}
          <div className="post-form__submit-area">
            <div className="post-form__image-area">
              <label htmlFor="file-input" className="post-form__file">
                <FiImage className="post-form__file-icon" />
              </label>
              <input
                id="file-input"
                type="file"
                name="file-input"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button type="submit" className="post-form__submit-btn">
                프로필 수정
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
