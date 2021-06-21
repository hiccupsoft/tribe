import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ children, ...rest }) {
  const { currentUser, loading } = useSelector(state => state.auth);
  return (
    <>
      {!loading && (
        <Route
          {...rest}
          render={({ location }) =>
            currentUser && ("sa" === currentUser.role || "admin" === currentUser.role) ? (
              children
            ) : (
              <Redirect
                to={{
                  pathname: "/",
                  state: { from: location }
                }}
              />
            )
          }
        />
      )}
    </>
  );
}

export default PrivateRoute;
