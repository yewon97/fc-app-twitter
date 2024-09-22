import { FiImage } from "react-icons/fi";
import { FaUserCircle, FaRegComment } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { Link } from "react-router-dom";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
}

const posts: PostProps[] = [
  {
    id: "1",
    email: "test1@test.com",
    content: "Hello, world!",
    createdAt: "2021-01-01",
    uid: "1",
  },
  {
    id: "2",
    email: "test2@test.com",
    content: "This is a test post.",
    createdAt: "2021-02-01",
    uid: "2",
  },
  {
    id: "3",
    email: "test3@test.com",
    content: "Another example post.",
    createdAt: "2021-03-01",
    uid: "3",
  },
  {
    id: "4",
    email: "test4@test.com",
    content: "Learning TypeScript is fun!",
    createdAt: "2021-04-01",
    uid: "4",
  },
];

export default function HomePage() {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
    }
  };

  const handleDelete = () => {
    console.log("delete");
  };

  return (
    <div className="home">
      <div className="home__title">Home</div>
      <div className="home__tabs">
        <div className="home__tab home__tab--active">For you</div>
        <div className="home__tab">Following</div>
      </div>

      {/* Post form */}
      <form action="" className="post-form">
        <textarea
          name="content"
          id="content"
          className="post-form__textarea"
          placeholder="What's happening?"
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

      {/* Tweet posts */}
      <div>
        <div className="post">
          {posts?.map((post) => (
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
                </div>
              </Link>
              <div className="post__box-footer">
                {/* post.uid === user.uid 일 때 */}
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
          ))}
        </div>
      </div>
    </div>
  );
}
