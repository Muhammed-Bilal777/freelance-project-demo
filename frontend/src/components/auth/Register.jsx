import React, { useEffect, useState } from "react";
 
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
 
import { useRegisterMutation } from "../../redux/apis/authApi";
import { useSelector } from "react-redux";
import { setIsAuthenticated } from "../../redux/features/userSlice";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });


  const navigate= useNavigate()
  const { name, email, password } = user;

  

  const [register, { isLoading, error, data,isSuccess }] = useRegisterMutation();

   
   

 
   
  useEffect(() => {


   
    if (isSuccess) {
      toast.success("Successfully Registered");
      navigate('/')
      navigate(0);
     
    }
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error ,isSuccess,data]);


 

  const submitHandler = (e) => {
    e.preventDefault();

    const signUpData = {
      name,
      email,
      password,
    };
    
    register(signUpData);

  };
 

  
 
  

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow rounded bg-body" onSubmit={submitHandler}>
          <h2 className="mb-4">Register</h2>

          <div className="mb-3">
            <label htmlFor="name_field" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email_field" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password_field" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={onChange}
            />
          </div>

          <button
            id="register_button"
            type="submit"
            className="btn w-100 py-2"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "REGISTER"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;