import React, { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../../Utils/AuthContext";
import Input from "../Input";
import Button from "../Button";

const LoginForm = () => {
  const [userLogin, setUserLogin] = useState({ username: "", password: "" });
  const { login, error } = useAuth();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    await login(userLogin);
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">We Welcome You!</h1>
      <div
        className="w-full max-w-md p-8 flex flex-col gap-5 bg-gray-800 shadow-md rounded-2xl border border-secondary"
      >
        <h1 className="inline-flex items-center text-2xl mb-4 flex-col">
          <LockClosedIcon className="h-8 w-8 mb-2" /> Login
        </h1>

        <form onSubmit={handleOnSubmit} className="flex flex-col gap-4 w-full">
          <Input
            placeholder="Enter your username..."
            name="username"
            value={userLogin.username}
            autoComplete="username"
            onChange={handleOnChange}
          />

          <Input
            placeholder="Enter your password..."
            name="password"
            type="password"
            value={userLogin.password}
            autoComplete="current-password"
            onChange={handleOnChange}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" disabled={!userLogin.username || !userLogin.password}>
            Login
          </Button>
        </form>

        <small className="text-center">
          Don&apos;t have an account? {" "}
          <a className="text-blue-500 hover:underline" href="/register">
            Register
          </a>
        </small>
      </div>
    </div>
  );
};

export default LoginForm;













// import React, { useState } from "react";
// import { LockClosedIcon } from "@heroicons/react/20/solid";
// import { useAuth } from "../../Utils/AuthContext";
// import Input from "../Input";
// import Button from "../Button";

// const LoginForm = () => {
//   const [userLogin, setUserLogin] = useState({ username: "", password: "" });

  
//   const { login, error } = useAuth();

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     setUserLogin((prev) => ({ ...prev, [name]: value }));

//   };

//   const handleOnSubmit = async (e) => {
//     e.preventDefault();
//     await login(userLogin);
     
//   };


//   return (

//     <>
//     <div className="flex justify-center items-center flex-col h-screen w-screen ">
//       <h1 className="text-3xl font-bold">We Welcome to You!</h1>
//       <div className="max-w-2xl w-1/2 p-8 flex justify-center items-center gap-5 flex-col back shadow-md rounded-2xl my-16 border-secondary border-[1px]"  style={{backgroundColor:" #162130"}}>

//       <h1 className="inline-flex items-center text-2xl mb-4 flex-col text-white">
//           <LockClosedIcon className="h-8 w-8 mb-2 text-white" /> Login
//         </h1>
        
//         <form onSubmit={handleOnSubmit} className="flex flex-col gap-4 w-full  text-white">
//           <Input
//             placeholder="Enter your username..."
//             name="username"
//             value={userLogin.username}
//             autoComplete="username"
//             onChange={handleOnChange}
//           />

//           <Input
//             placeholder="Enter your password..."
//             name="password"
//             type="password"
//             value={userLogin.password}
//             autoComplete="current-password"
//             onChange={handleOnChange}
//           />

//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           <Button type="submit" disabled={!userLogin.username || !userLogin.password}>
//             Login
//           </Button>
//         </form>

//         <small className=" text-white">
//           Don&apos;t have an account? {" "}
//           <a className="text-blue-700 hover:underline" href="/register">
//             Register
//           </a>
//         </small>
//       </div>
//     </div>
//     </>
//   );
// };

// export default LoginForm;
