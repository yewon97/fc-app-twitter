import { FiImage } from "react-icons/fi";

export default function PostForm() {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
    }
  };

  return (
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
  );
}
