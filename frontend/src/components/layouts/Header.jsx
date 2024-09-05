import React, { useCallback, useEffect } from "react";

import Search from "./Search";
import { Link, useNavigate } from "react-router-dom";
import { useGetMeQuery     } from "../../redux/apis/userApi";
import { useSelector } from "react-redux";
import { useLazyLogoutQuery } from "../../redux/apis/authApi";
import { useDispatch } from "react-redux";
import { setIsAuthenticated, setUser } from "../../redux/features/userSlice";
 
const Header = () => {
const dispatch =useDispatch()
  const navigate = useNavigate();
 
   



  const { user } = useSelector((state) => state.auth);

  const { data, isLoading,isFetching ,error ,refetch,isSuccess} = useGetMeQuery(undefined, {
     
    
  });
 
  
 

  const [logout ,{}] = useLazyLogoutQuery();
 












  const logoutHandler = async () => {
    await logout();
     
    navigate('/');
    dispatch(setIsAuthenticated(false))
    dispatch(setUser(null))
    

  };

 
   

  return (
    <nav className="navbar row">
      <div className="col-12 col-md-3 ps-5">
        <div className="navbar-brand">
           
          <Link to="/">
          <img src="/images/shopit_logo.png" alt="ShopIT Logo" />
          </Link>
        </div>
      </div>
      <div className="col-12 col-md-6 mt-2 mt-md-0">
        <Search />
      </div>
      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        <a href="/cart" style={{ textDecoration: "none" }}>
          <span id="cart" className="ms-3">
            {" "}
            Cart{" "}
          </span>
          <span className="ms-1" id="cart_count">
            0
          </span>
        </a>
  {
    user ? (
      <div className="ms-4 dropdown">
          <button
            className="btn dropdown-toggle text-white"
            type="button"
            id="dropDownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <figure className="avatar avatar-nav">
              <img
                src={user.avatar ? user?.avatar?.url : "/images/default_avatar.jpg"}
                alt="User Avatar"
                className="rounded-circle"
              />
            </figure>
            <span>{user.name}</span>
          </button>
          <div
            className="dropdown-menu w-100"
            aria-labelledby="dropDownMenuButton"
          >
            <Link className="dropdown-item" to="/admin/dashboard">
              {" "}
              Dashboard{" "}
            </Link>

            <Link className="dropdown-item" to="/me/orders">
              {" "}
              Orders{" "}
            </Link>

            <Link className="dropdown-item" to="/me/profile">
              {" "}
              Profile{" "}
            </Link>

            <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}>
              {" "}
              Logout{" "}
            </Link>
          </div>
        </div>
    ):(
   
      !isLoading && ( <Link to="/login" className="btn ms-4" id="login_btn">
        {" "}
        Login{" "}
      </Link>)
  
    )
  }
        

        
      </div>
    </nav>
  );
};

export default Header;