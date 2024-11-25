import AuthContext from "@/components/context/AuthContext";
import PostHeader from "@/components/posts/Header";
import { db, storage } from "@/firebaseApp";
import { PostProps } from "@/pages/home";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { useCallback, useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function PostEditForm() {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [hashtag, setHashtag] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

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
      file: postSnap.data()?.imageUrl,
    });
    setHashtags(postSnap.data()?.hashtags);
  }, [params.id]);

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

  useEffect(() => {
    if (params.id) {
      getPost();
    }
  }, [getPost, params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    e.preventDefault();

    try {
      if (post) {
        // 기존 사진 지우고
        if (post?.imageUrl) {
          let imageRef = ref(storage, post?.imageUrl);
          await deleteObject(imageRef).catch((error: any) => {
            console.log(error);
          });
          setFormData({ ...formData, file: null });
        }

        // 새로운 사진 업로드
        let imageUrl = "";
        if (formData.file) {
          const uploadTask = await uploadString(
            storageRef,
            formData.file,
            "data_url",
          );
          imageUrl = await getDownloadURL(uploadTask.ref);
        }

        // 만약 사진이 아예 없다면 삭제

        const postRef = doc(db, "posts", post?.id);
        await updateDoc(postRef, {
          content: formData.content,
          imageUrl: imageUrl,
          hashtags: hashtags,
        });
        navigate(`/posts/${post?.id}`);
        toast.success("게시물을 수정했습니다.");
      }

      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClearFile = () => {
    setFormData({ ...formData, file: null });
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
    <div className="post">
      <PostHeader />
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
          {hashtags?.map((hashtag, index) => (
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
            Edit
          </button>
        </div>
      </form>
    </div>
  );
}
