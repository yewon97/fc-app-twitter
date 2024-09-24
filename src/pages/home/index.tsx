import PostForm from "@/components/PostForm";
import PostBox from "@/components/PostBox";

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
  return (
    <div className="home">
      <div className="home__title">Home</div>
      <div className="home__tabs">
        <div className="home__tab home__tab--active">For you</div>
        <div className="home__tab">Following</div>
      </div>

      {/* Post form */}
      <PostForm />

      {/* Tweet posts */}
      <div>
        <div className="post">
          {posts?.map((post) => (
            <PostBox key={post?.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
