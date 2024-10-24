import { app } from "@/firebaseApp";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface formProps {
  email: string;
  password: string;
  password_confirmation: string;
}

export default function SignupForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState<formProps>({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setForm((prev) => ({ ...prev, email: value }));

      const validRegexEmail =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!validRegexEmail.test(value)) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError("");
      }
    } else if (name === "password") {
      setForm((prev) => ({ ...prev, password: value }));

      if (value.length < 8) {
        setError("비밀번호는 8자 이상이어야 합니다.");
      } else {
        setError("");
      }
    } else if (name === "password_confirmation") {
      setForm((prev) => ({ ...prev, password_confirmation: value }));

      if (value.length < 8) {
        setError("비밀번호는 8자 이상이어야 합니다.");
      } else if (value !== form.password) {
        setError("비밀번호가 일치하지 않습니다.");
      } else {
        setError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      navigate("/");
      toast.success("회원가입이 성공했습니다.");
    } catch (error) {
      console.log(error);
      toast.error("회원가입이 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form form--lg">
      <div className="form__title">회원가입</div>
      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input
          type="text"
          name="email"
          id="email"
          value={form.email}
          required
          onChange={handleChange}
        />
      </div>
      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          value={form.password}
          onChange={handleChange}
        />
      </div>
      <div className="form__block">
        <label htmlFor="password_confirmation">비밀번호 확인</label>
        <input
          type="password"
          name="password_confirmation"
          id="password_confirmation"
          required
          value={form.password_confirmation}
          onChange={handleChange}
        />
      </div>

      {/* 만약 에러가 있다면 */}
      {error && error?.length > 0 && (
        <div className="form__block">
          <div className="form__error">
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="form__block">
        계정이 있으신가요?
        <Link to="/login" className="form__link">
          로그인하기
        </Link>
      </div>
      <div className="form__block">
        <button
          type="submit"
          className="form__btn--submit"
          disabled={!!error && error.length > 0}
        >
          회원가입
        </button>
      </div>
    </form>
  );
}
