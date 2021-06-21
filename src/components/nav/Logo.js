import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import constans from "../../constants.json";

const Logo = () => {
  const { platformData } = useSelector(state => state.frontend);
  return (
    <Link to="/">
      <img className="h-10 w-auto" src={constans.cdnUrl + platformData.logo} alt="Logo" />
    </Link>
  );
};

export default Logo;
