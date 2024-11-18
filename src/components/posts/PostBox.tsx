import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { PostProps } from "@/pages/home";
import AuthContext from "@/components/context/AuthContext";
import { useContext } from "react";
import { db, storage } from "@/firebaseApp";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { ref, deleteObject } from "firebase/storage";

interface PostBoxProps {
  post: PostProps;
}

export default function PostBox({ post }: PostBoxProps) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const imageRef = ref(storage, post?.imageUrl);

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      // firebase 스토리지 & firebase store는 별개의 서비스
      // firebase storage에서 이미지 URL 먼저 지워야함

      if (post?.imageUrl) {
        deleteObject(imageRef).catch((error) => {
          console.log(error);
        });
      }

      await deleteDoc(doc(db, "posts", post?.id));
      toast.success("게시글을 삭제했습니다.");
      navigate("/");
    }
  };

  return (
    <div className="post__box" key={post?.id}>
      <Link to={`/posts/${post?.id}`}>
        <div className="post__box-profile">
          <div className="post__flex">
            {post?.profileUrl ? (
              <img
                src={post?.profileUrl}
                alt="profile"
                className="post__box-profile-img"
              />
            ) : (
              <FaUserCircle className="post__box-profile-icon" />
            )}
            <div className="post__email">{post?.email}</div>
            <div className="post__createdAt">{post?.createdAt}</div>
          </div>
          <div className="post__box-content">{post?.content}</div>
          {post?.imageUrl && (
            <div className="post__image-div">
              <img
                src={post?.imageUrl}
                alt="post img"
                className="post__image"
                width={100}
                height={100}
              />
            </div>
          )}
          <div className="post__box-hashtags">
            {post?.hashtags?.map((hashtag, index) => (
              <span key={index} className="post-form__hashtags-tag">
                #{hashtag}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <div className="post__box-footer">
        {/* post.uid === user.uid 일 때 */}
        {user?.uid === post?.uid && (
          <>
            <button
              type="button"
              className="post__delete"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button type="button" className="post__edit">
              <Link to={`/posts/edit/${post?.id}`}>Edit</Link>
            </button>
          </>
        )}
        <button type="button" className="post__likes">
          <AiFillHeart />
          {post?.likeCount || 0}
        </button>
        <button type="button" className="post__comments">
          <FaRegComment />
          {post?.comments?.length || 0}
        </button>
      </div>
    </div>
  );
}
