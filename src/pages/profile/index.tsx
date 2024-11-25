import { useState, useEffect, useContext } from "react";
import { PostProps } from "@/pages/home";
import PostBox from "@/components/posts/PostBox";
import { db } from "@/firebaseApp";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import AuthContext from "@/components/context/AuthContext";
import { useNavigate } from "react-router-dom";

const PROFILE_DEFAULT_IMAGE_URL = "/logo512.png";

export default function ProfilePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, "posts");
      let postsQuery = query(
        postsRef,
        where("uid", "==", user?.uid),
        orderBy("createdAt", "desc"),
      );

      onSnapshot(postsQuery, (snapshot) => {
        let dataObj = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setPosts(dataObj as PostProps[]);
      });
    }
  }, [user]);

  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">Profile</div>

        <div className="profile">
          <img
            src={user?.photoURL || PROFILE_DEFAULT_IMAGE_URL}
            alt="profile"
            className="profile__image"
          />
          <button
            type="button"
            className="profile__btn"
            onClick={() => {
              navigate("/profile/edit");
            }}
          >
            Edit profile
          </button>
        </div>
        <div className="profile__text">
          <div className="profile__name">{user?.displayName || "사용자님"}</div>
          <div className="profile__email">{user?.email}</div>
        </div>
        <div className="home__tabs">
          <div className="home__tab home__tab--active">For you</div>
          <div className="home__tab">Likes</div>
        </div>
        <div className="post">
          {posts.length > 0 ? (
            posts?.map((post) => <PostBox key={post?.id} post={post} />)
          ) : (
            <div className="post__no-posts">
              <div className="post__text">게시글이 없습니다.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
