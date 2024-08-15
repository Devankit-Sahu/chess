const AuthForm = ({
  type,
  submitHandler,
  formData,
  changeHandler,
}: {
  type: string;
  submitHandler: React.FormEventHandler<HTMLFormElement>;
  formData: form;
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className={`${type === "login" ? "login-form" : "signup-form"}`}>
      {type === "login" ? <h1>Login</h1> : <h1>Sign Up</h1>}
      <form onSubmit={submitHandler} noValidate>
        {type === "signup" && (
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username || ""}
              onChange={changeHandler}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        )}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={changeHandler}
            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={changeHandler}
            autoComplete="off"
            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {type === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
