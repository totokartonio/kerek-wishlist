import { useState } from "react";
import { signIn, signUp } from "../../lib/auth-client";
import { SignInForm } from "./atoms/SignInForm";
import { SignUpForm } from "./atoms/SignUpForm";
import { useNavigate, useSearch } from "@tanstack/react-router";
import styles from "./Login.module.css";
import Card from "../ui/Card";

type MessageType = "error" | "success" | "info";

export type Message = {
  type: MessageType;
  text: string;
} | null;

const Login = () => {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const { message: successParam } = useSearch({ from: "/login" });
  const [message, setMessage] = useState<Message>(
    successParam ? { type: "success", text: successParam } : null,
  );
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    name: "",
  });

  const navigate = useNavigate();

  const hasErrors = () => {
    const errors = {
      email: !formData.email
        ? "Email is required"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
          ? "Invalid email format"
          : "",
      password: !formData.password
        ? "Password is required"
        : formData.password.length < 8
          ? "Password must be at least 8 characters"
          : "",
      name: mode === "sign-up" && !formData.name ? "Name is required" : "",
    };
    setFieldErrors(errors);
    return Object.values(errors).some(Boolean);
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hasErrors()) return;

    try {
      if (mode === "sign-in") {
        const { error } = await signIn.email({
          email: formData.email,
          password: formData.password,
        });
        if (error)
          setMessage({
            type: "error",
            text: error.message ?? "Failed to sign in",
          });
        else navigate({ to: "/dashboard" });
      }

      if (mode === "sign-up") {
        const { error } = await signUp.email({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
        if (error)
          setMessage({
            type: "error",
            text: error.message ?? "Failed to sign up",
          });
        else {
          navigate({
            to: "/login",
            search: { message: "Account created! Please sign in." },
          });
        }
      }
    } catch {
      setMessage({
        type: "error",
        text: "Connection failed. Please check your internet connection.",
      });
    }
  };

  const hanldeChangeMode = () => {
    setMessage(null);
    if (mode === "sign-in") setMode("sign-up");
    if (mode === "sign-up") setMode("sign-in");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    switch (name) {
      case "email":
        if (!value)
          setFieldErrors((prev) => ({ ...prev, email: "Email is required" }));
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          setFieldErrors((prev) => ({
            ...prev,
            email: "Invalid email format",
          }));
        else setFieldErrors((prev) => ({ ...prev, email: "" }));
        break;

      case "password":
        if (!value)
          setFieldErrors((prev) => ({
            ...prev,
            password: "Password is required",
          }));
        else if (value.length < 8)
          setFieldErrors((prev) => ({
            ...prev,
            password: "Password must be at least 8 characters",
          }));
        else setFieldErrors((prev) => ({ ...prev, password: "" }));
        break;

      case "name":
        if (!value)
          setFieldErrors((prev) => ({ ...prev, name: "Name is required" }));
        else setFieldErrors((prev) => ({ ...prev, name: "" }));
        break;
    }
  };

  return (
    <div className={styles.page}>
      <Card color="secondary" className={styles.card}>
        <h1>{mode === "sign-in" ? "Sign In" : "Sign Up"}</h1>
        {mode === "sign-in" ? (
          <SignInForm
            email={formData.email}
            password={formData.password}
            fieldErrors={fieldErrors}
            message={message}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onBlur={handleBlur}
            onChangeMode={hanldeChangeMode}
          />
        ) : (
          <SignUpForm
            email={formData.email}
            password={formData.password}
            name={formData.name}
            fieldErrors={fieldErrors}
            message={message}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onBlur={handleBlur}
            onChangeMode={hanldeChangeMode}
          />
        )}
      </Card>
    </div>
  );
};

export { Login };
