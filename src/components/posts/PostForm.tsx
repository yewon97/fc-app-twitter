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

      toast.success("게시물이 등록되었습니다.");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
