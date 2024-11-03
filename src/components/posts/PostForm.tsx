import AuthContext from "@/components/context/AuthContext";
import { db } from "@/firebaseApp";
import { addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";

export default function PostForm() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    content: "",
    file: null,
  });

  const [hashtag, setHashtag] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "posts"), {
        content: formData.content,
        file: formData.file,
        uid: user?.uid,
        email: user?.email,
        hashtags: hashtags,
        createdAt: new Date()?.toLocaleDateString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      });

      setFormData({
        content: "",
        file: null,
      });
      setHashtags([]);
      setHashtag("");

      toast.success("게시물이 등록되었습니다.");
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
        <button type="submit" className="post-form__submit-btn">
          Tweet
        </button>
      </div>
    </form>
  );
}
