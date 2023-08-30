import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../store/userApiSlice";
import { setCredentials } from "../../store/authSlice";
import "./style.scss";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo === null) {
      navigate("/login");
    } else if (userInfo !== null) {
      if (userInfo.message) {
        navigate("/login");
      } else if (userInfo.other) {
        navigate("/");
      }
    }
  }, [navigate, userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userDetails = await login(formData).unwrap();
      dispatch(setCredentials({ ...userDetails }));
      navigate("/");
    } catch (err) {
      setShowError(true);
      console.log(err.data);
      setErrorMessage(err.data);
    }
  };

  return (
    <div className="container">
      <div className="flex flex-col justify-center items-center p-8 rounded-lg shadow-md w-full h-auto">
        <h2 className="text-white text-2xl font-bold mb-4">
          Login to your Account
        </h2>
        <form
          className="flex flex-col justify-center items-center space-y-5 w-full m-3"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center items-center space-x-5">
            <label className="form-text" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="input form-input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-center items-center space-x-5">
            <label className="form-text" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input form-input"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <button
              type="submit"
              className="btn justify-center items-center mt-1"
            >
              Login
            </button>
          </div>
        </form>

        {showError && (
          <div>
            <p className="text-red-600/80 mt-2">{errorMessage}</p>
          </div>
        )}

        <div className="flex justify-center items-center space-x-3 mt-5">
          <p className="text-paraColor">Don&apos;t have an account? </p>
          <Link to="/register">
            <span className="text-hoverColor">Register</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
