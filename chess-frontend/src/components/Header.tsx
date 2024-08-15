const Header = () => {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  return (
    <header>
      <div className="max-w-7xl mx-auto w-full px-10 2xl:px20 flex justify-between items-center">
        <h1>CHESS</h1>
        <div>
          {user ? (
            <div className="flex gap-3 items-center">
              <span>{user?.username}</span>
              <button>Logout</button>
            </div>
          ) : (
            <div className="flex gap-3 items-center">
              <button>Login</button>
              <button>Register</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
