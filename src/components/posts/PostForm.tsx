import AuthContext from "@/components/context/AuthContext";
import { db, storage } from "@/firebaseApp";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function PostForm() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    content: "",
    file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [hashtag, setHashtag] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = (e) => {
        const { result } = e.currentTarget as FileReader;
        setFormData({
          ...formData,
          file: result as string | null as any,
        });
      };
    }
  };

  const handleClearFile = () => {
    setFormData({ ...formData, file: null });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    e.preventDefault();

    try {
      // 이미지 먼저 업로드
      let imageUrl = "";
      if (formData.file) {
        const uploadTask = await uploadString(
          storageRef,
          formData.file,
          "data_url",
        );
        imageUrl = await getDownloadURL(uploadTask.ref);
      }

      // 업로드 된 이미지의 download url 업데이트
      await addDoc(collection(db, "posts"), {
        content: formData.content,
        uid: user?.uid,
        email: user?.email,
        hashtags: hashtags,
        createdAt: new Date()?.toLocaleDateString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        imageUrl: imageUrl,
      });

      setFormData({
        content: "",
        file: null,
      });
      setHashtags([]);
      setHashtag("");

      toast.success("게시물이 등록되었습니다.");
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleHashtagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setHashtag(value.trim());
  };

  const handleHashtagKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (e.code === "Space" && target.value.trim() !== "") {
      if (hashtags.includes(target.value?.trim())) {
        toast.error("이미 존재하는 태그입니다.");
      } else {
        setHashtags((prev) =>
          prev?.length > 0 ? [...prev, hashtag] : [hashtag],
        );
        setHashtag("");
      }
    }
  };

  const handleRemoveTag = (hashtag: string) => {
    setHashtags(hashtags.filter((tag) => tag !== hashtag));
  };

  return (
    <form action="" className="post-form" onSubmit={handleSubmit}>
      <textarea
        name="content"
        id="content"
        className="post-form__textarea"
        placeholder="What's happening?"
        onChange={handleChange}
        value={formData.content}
        required
      ></textarea>
      <div className="post-form__hashtags">
        {hashtags.map((hashtag, index) => (
          <span
            key={index}
            className="post-form__hashtags-tag"
            onClick={() => handleRemoveTag(hashtag)}
          >
            #{hashtag}
          </span>
        ))}
        <input
          type="text"
          className="post-form__input"
          id="hashtag"
          name="hashtag"
          placeholder="해시태그 + 스페이스바 입력"
          onChange={handleHashtagChange}
          onKeyUp={handleHashtagKeyUp}
          value={hashtag}
        />
      </div>
      <div className="post-form__submit-area">
        <div className="post-form__image-area">
          <label htmlFor="file-input" className="post-form__file">
            <FiImage className="post-form__file-icon" />
          </label>
          <input
            type="file"
            name="file-input"
            id="file-input"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
          />
          {formData.file && (
            <div className="post-form__attachment">
              <img
                src={formData.file}
                alt="uploaded"
                className="post-form__image"
              />
              <button
                type="button"
                className="post-form__clear-btn"
                onClick={handleClearFile}
              >
                Clear
              </button>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="post-form__submit-btn"
          disabled={isSubmitting}
        >
          Tweet
        </button>
      </div>
    </form>
  );
}
