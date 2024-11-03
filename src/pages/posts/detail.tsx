import Loader from "@/components/loader/Loader";
import PostBox from "@/components/posts/PostBox";
import { db } from "@/firebaseApp";
import { PostProps } from "@/pages/home";
import { getDoc, doc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

export default function PostDetailPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostProps | null>(null);

  const getPost = useCallback(async () => {
    if (!params.id) return;

    const postRef = doc(db, "posts", params?.id);
    const postSnap = await getDoc(postRef);

    setPost({ ...postSnap?.data(), id: postSnap?.id } as PostProps);
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      getPost();
    }
  }, [getPost, params.id]);

  return (
    <div className="post">
      <div className="post__header">
        <button type="button" onClick={() => navigate(-1)}>
          <IoIosArrowBack className="post__header-btn" />
        </button>
      </div>
      {post ? <PostBox post={post} /> : <Loader />}
    </div>
  );
}
