import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const user = JSON.parse(localStorage.getItem("usuario"));
  const userRole = user?.fkUtilizador?.fkTipoConta?.designacao;

  const token = localStorage.getItem('authToken');

  return (

    
    <Route
      {...rest}
      render={(props) => {
        if (!token) {
          return <Redirect to="/login" />;
        }
        if (!user) {
          return <Redirect to="/login" />;
        }

        if (!allowedRoles.includes(userRole)) {
          return <Redirect to="/unauthorized" />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
