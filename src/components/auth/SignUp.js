import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loginAsync, setLoginModalState } from "../../features/auth/authSlice";
import { upsertUserAsync } from "../../features/user/userSlice";

const SignUp = () => {
  const dispatch = useDispatch();

  const [state, setState] = useState({ role: "free" }); // form state
  const { error } = useSelector(state => state.auth);
  const { platformData } = useSelector(state => state.frontend);

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
    dispatch(upsertUserAsync({ user: state, PlatformId: platformData.id })).then(action => {
      if ("user/upsert/fulfilled" === action.type) {
        dispatch(
          setLoginModalState({
            loginModalShowing: false
          })
        );
        dispatch(loginAsync(state));
      }
    });
  };

  return (
    <form onSubmit={event => onSubmit(event)}>
      {error && <p className="text-sm leading-5 font-medium text-red-800 mb-1">{error}</p>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium leading-5 text-gray-700">
          Full name
        </label>
        <div className="mt-1 rounded-md shadow-sm">
          <input
            id="name"
            name="name"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            value={(state && state.name) || ""}
            onChange={event => onChange(event)}
          />
        </div>
      </div>

      <div className="mt-6">
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

      {/*<div className='mt-6'>
        <label
          htmlFor='password2'
          className='block text-sm font-medium leading-5 text-gray-700'
        >
          Password Confirmation
        </label>
        <div className='mt-1 rounded-md shadow-sm'>
          <input
            id='password2'
            type='password2'
            name='password2'
            required
            className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5'
            value={(state && state.password2) || ""}
            onChange={(event) => onChange(event)}
          />
        </div>
      </div>*/}

      <div className="mt-6">
        <span className="block w-full rounded-md shadow-sm">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:shadow-outline-indigo active:bg-blue-700 transition duration-150 ease-in-out"
          >
            Create an account
          </button>
        </span>
      </div>
    </form>
  );
};

export default SignUp;
