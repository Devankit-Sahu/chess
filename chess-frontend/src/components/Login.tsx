import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { useState } from "react";
import axios from "axios";
import { server } from "../config/config";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Form>({
    email: "",
    password: "",
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await axios.post(`${server}/api/user/login`, formData, {
      withCredentials: true,
    });
    localStorage.setItem("user", JSON.stringify(data));
    navigate("/");
  };

  return (
    <section className="h-screen w-full max-w-7xl mx-auto">
      <div className="h-full flex items-center justify-center">
        <AuthForm
          type="login"
          submitHandler={submitHandler}
          changeHandler={changeHandler}
          formData={formData}
        />
      </div>
    </section>
  );
};

export default Login;
