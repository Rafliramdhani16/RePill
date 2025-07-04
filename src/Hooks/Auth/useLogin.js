import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  selectIsLoading,
  selectError,
} from "../../Redux/Features/Auth/AuthStore";
import { login as loginService } from "../../Services/Auth/AuthService";

const useLogin = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e, onSuccess, onError) => {
    e.preventDefault();

    try {
      dispatch(loginStart());
      const response = await loginService(formData);

      if (response.success) {
        setTimeout(() => {
          dispatch(
            loginSuccess({
              user: response.data.user,
              token: response.data.token,
            })
          );
        }, 100);

        if (onSuccess) {
          // Fix: Access role from the correct nested structure
          const userRole = response.data?.user?.role?.name;
          const userName =
            response.data?.user?.fullname ||
            response.data?.user?.username ||
            "Pengguna";

          onSuccess({
            message: `Selamat datang, ${userName}! Login berhasil dan Anda akan diarahkan ke halaman utama.`,
            type: "success",
            data: response.data,
            user: response.data.user,
            token: response.data.token,
            role: userRole,
          });
        }
      } else {
        throw new Error(response.message || "Login gagal. Silakan coba lagi.");
      }
    } catch (error) {
      const errorMessage =
        error.message || "Terjadi kesalahan saat login. Silakan coba lagi.";
      dispatch(loginFailure(errorMessage));

      if (onError) {
        onError({
          message: errorMessage,
          type: error.type || "error",
          status: error.status,
        });
      }
    }
  };

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  };
};

export default useLogin;
