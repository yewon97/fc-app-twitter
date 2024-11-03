import { db } from "@/firebaseApp";
import { PostProps } from "@/pages/home";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostEditForm() {
  const params = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    content: "",
    file: null,
  });
  const [post, setPost] = useState<PostProps | null>(null);

  // useCallback 의존성 관리 > params.id 가 변경되지 않으면 함수 재생성 X
  const getPost = useCallback(async () => {
    if (!params.id) return;

    const postRef = doc(db, "posts", params.id);
    const postSnap = await getDoc(postRef);

    setPost({ ...postSnap?.data(), id: postSnap?.id } as PostProps);
    setFormData({
      content: postSnap.data()?.content,
      file: postSnap.data()?.file,
    });
  }, [params.id]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
    }
  };

  useEffect(() => {
    if (params.id) {
      getPost();
    }
  }, [getPost, params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (post) {
        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          content: formData.content,
          file: formData.file,
        });
      }

      navigate(`/posts/${post?.id}`);
      toast.success("게시물을 수정했습니다.");
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
          Edit
        </button>
      </div>
    </form>
  );
}
