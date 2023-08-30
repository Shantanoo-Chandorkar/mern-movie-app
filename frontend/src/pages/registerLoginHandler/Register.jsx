import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../store/userApiSlice";
import { setCredentials } from "../../store/authSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await register(formData).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/login");
    } catch (err) {
      setShowError(true);
      console.log(err.data.error);
      setErrorMessage(err.data.error);
    }
  };

  return (
    <div className="flex justify-center items-center container">
      <div className="flex flex-col justify-center items-center p-8 rounded-lg shadow-md w-full">
        <h2 className="text-white text-2xl font-bold mb-4">
          Register for an Account
        </h2>
        <form
          className="flex flex-col justify-center items-center space-y-5 w-full m-3"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center items-center space-x-5">
            <label className="form-text" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input form-input"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
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
          <div className="flex justify-center items-center space-x-5">
            <label className="form-text" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="input form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <button
              type="submit"
              className="btn justify-center items-center mt-1"
            >
              Register
            </button>
          </div>
        </form>
        {showError && (
          <div>
            <p className="text-red-600/80 mt-2">{errorMessage}</p>
          </div>
        )}
        <div className="flex justify-center items-center space-x-3 mt-5">
          <p className="text-paraColor">Already have an account? </p>
          <Link to="/login">
            <span className="text-hoverColor">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
