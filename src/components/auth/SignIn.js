import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loginAsync, setLoginModalState } from "../../features/auth/authSlice";

const SignIn = () => {
  const dispatch = useDispatch();

  const [state, setState] = useState({}); // form state
  const { error } = useSelector(state => state.auth);

  const onChange = event => {
    dispatch(clearErrors());

    const { name, value } = event.target;

    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const onSubmit = event => {
    event.preventDefault();
    dispatch(loginAsync(state)).then(action => {
      if ("auth/signin/fulfilled" === action.type) {
        dispatch(
          setLoginModalState({
            loginModalShowing: false
          })
        );
      }
    });
  };

  return (
    <form onSubmit={event => onSubmit(event)}>
      {error && <p className="text-sm leading-5 font-medium text-red-800 mb-1">{error}</p>}
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
          Email address
        </label>
        <div className="mt-1 rounded-md shadow-sm">
          <input
            id="email"
            type="email"
            name="email"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            value={(state && state.email) || ""}
            onChange={event => onChange(event)}
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="password" className="block text-sm font-medium leading-5 text-gray-700">
          Password
        </label>
        <div className="mt-1 rounded-md shadow-sm">
          <input
            id="password"
            type="password"
            name="password"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            value={(state && state.password) || ""}
            onChange={event => onChange(event)}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between hidden">
        <div className="flex items-center">
          <input
            id="remember_me"
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
          />
          <label htmlFor="remember_me" className="ml-2 block text-sm leading-5 text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm leading-5 hidden">
          <button
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
            onClick={() => {
              /*dispatch(
                setLoginModalState({
                  loginModalShowing: true,
                  activeAuthForm: "resetPassword",
                })
              )*/
            }}
          >
            Forgot your password?
          </button>
        </div>
      </div>

      <div className="mt-6">
        <span className="block w-full rounded-md shadow-sm">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:shadow-outline-indigo active:bg-blue-700 transition duration-150 ease-in-out"
          >
            Sign in
          </button>
        </span>
      </div>
    </form>
  );
};

export default SignIn;
