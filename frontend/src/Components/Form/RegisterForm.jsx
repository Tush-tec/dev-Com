import React, { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import Input from "../Input";
import Button from "../Button";
import { useAuth } from "../../Utils/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    avatar: null,
  });

  const handleRegistration = (e) => {
    const { name, value, files } = e.target;

    setRegisterData((prevDetails) => ({
      ...prevDetails,
      [name]: name === "avatar" ? files[0] : value,
    }));
  };

  const handleOnRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(registerData).forEach((key) => {
      formData.append(key, registerData[key]);
    });

    await register(formData);
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen p-4 text-white">
      <div
        className="w-full max-w-md p-8 flex flex-col gap-5 bg-gray-800 shadow-md rounded-2xl border border-secondary"
      >
        <h1 className="inline-flex items-center text-2xl mb-4 flex-col">
          <LockClosedIcon className="h-8 w-8 mb-2" /> Register
        </h1>

        {error && <p className="text-red-500">{error}</p>}
        <form action="" className="flex flex-col gap-4 w-full">
          <Input
            placeholder="Enter the email..."
            type="email"
            value={registerData.email}
            onChange={handleRegistration}
            name="email"
          />
          <Input
            placeholder="Enter the username..."
            value={registerData.username}
            onChange={handleRegistration}
            name="username"
          />
          <Input
            placeholder="Enter the full name..."
            value={registerData.fullname}
            onChange={handleRegistration}
            name="fullname"
          />
          <Input
            placeholder="Enter the password..."
            type="password"
            value={registerData.password}
            onChange={handleRegistration}
            name="password"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleRegistration}
            className="text-sm text-gray-500"
            name="avatar"
          />
        </form>

        <Button
          disabled={Object.values(registerData).some(
            (val) => val === "" || val === null
          )}
          onClick={handleOnRegister}
        >
          Register
        </Button>

        <small className="text-center text-white-500">
          Already have an account? {" "}
          <a className="text-blue-500 hover:underline" href="/login">
            Login
          </a>
        </small>
      </div>
    </div>
  );
};

export default RegisterForm;




// import React, { useState } from "react";
// import { LockClosedIcon } from "@heroicons/react/20/solid";
// import Input from "../Input";
// import Button from "../Button";
// import { useAuth } from "../../Utils/AuthContext";
// import { useNavigate } from "react-router-dom";

// const RegisterForm = () => {
//   const { register, error } = useAuth();
//   const navigate = useNavigate();

//   const [registerData, setRegisterData] = useState({
//     username: "",
//     email: "",
//     fullname: "",
//     password: "",
//     avatar: null,
//   });

//   const handleRegistration = (e) => {
//     const { name, value, files } = e.target;

//     setRegisterData((prevDetails) => ({
//       ...prevDetails,
//       [name]: name === "avatar" ? files[0] : value,
//     }));
//     // console.log(setRegisterData)
//   };

//   const handleOnRegister = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     Object.keys(registerData).forEach((key) => {
//       formData.append(key, registerData[key]);
//     });

//     await register(formData);
//   };

//   return (
//     <>
//       <div className="flex justify-center items-center flex-col h-screen w-screen">
//         <div
//           className="max-w-5xl w-1/2 p-8 flex justify-center items-center gap-5 flex-col  bg-dark shadow-md rounded-2xl my-16 border-secondary border-[1px]"
//           style={{ backgroundColor: " #162130" }}
//         >
//           <h1 className="inline-flex items-center text-2xl mb-4 flex-col text-white">
//             <LockClosedIcon className="h-8 w-8 mb-2 text-white" /> Register
//           </h1>

//           {error && <p className="text-red-500">{error}</p>}
//           <form action="" className="text-white flex flex-col gap-4 w-full">
//             <Input
//               placeholder="Enter the email..."
//               type="email"
//               value={registerData.email}
//               onChange={handleRegistration}
//               name="email"
//             />
//             <Input
//               placeholder="Enter the username..."
//               value={registerData.username}
//               onChange={handleRegistration}
//               name="username"
//             />
//             <Input
//               placeholder="Enter the full name..."
//               value={registerData.fullname}
//               onChange={handleRegistration}
//               name="fullname"
//             />
//             <Input
//               placeholder="Enter the password..."
//               type="password"
//               value={registerData.password}
//               onChange={handleRegistration}
//               name="password"
//             />
//             <Input
//               type="file"
//               accept="image/*"
//               onChange={handleRegistration}
//               className="text-sm text-gray-500"
//               name="avatar"
//             />
//           </form>

//           {/* Register button */}
//           <Button
//             disabled={Object.values(registerData).some(
//               (val) => val === "" || val === null
//             )}
//             onClick={handleOnRegister}
//           >
//             Register
//           </Button>

//           {/* Login link */}
//           <small className="text-blue-700">
//             Already have an account?{" "}
//             <a className="text-primary hover:underline" href="/login">
//               Login
//             </a>
//           </small>
//         </div>
//       </div>
//     </>
//   );
// };

// export default RegisterForm;
