import { useState } from "react";

import { PiEye } from "react-icons/pi";
import { PiEyeSlash } from "react-icons/pi";
import { Link } from "react-router-dom";

const ForgotPass = () => {
  //useState untuk password
  const [newPassValue, setNewPassValue] = useState({
    password: "",
    showPass: false,
  });
  const [passValue, setPassValue] = useState({
    password: "",
    showPass: false,
  });

  //handle onchange password
  const handlePass1 = (event) => {
    setNewPassValue({ ...newPassValue, password: event.target.value });
  };
  const handlePass2 = (event) => {
    setPassValue({ ...passValue, password: event.target.value });
  };

  //buat ganti dari type password ke type text
  const toggleVisibility1 = () => {
    setNewPassValue({ ...newPassValue, showPass: !newPassValue.showPass });
  };
  const toggleVisibility2 = () => {
    setPassValue({ ...passValue, showPass: !passValue.showPass });
  };

  const showAlert = (message, type = "info", duration = 5000) => {
    const tempatAlert = document.querySelector(".tempatAlert");
    const alertElement = document.createElement("div");
    alertElement.classList.add("custom-alert");
    alertElement.classList.add("text-white");
    alertElement.classList.add("rounded-lg");
    alertElement.classList.add("w-[250px]");
    alertElement.classList.add("items-center");
    alertElement.classList.add("text-center");
    alertElement.classList.add("py-2");
    alertElement.classList.add("px-5");
    alertElement.classList.add("text-xs");
    alertElement.classList.add("bottom-6");
    alertElement.classList.add("mx-auto");

    if (type === "success") {
      alertElement.classList.add("bg-alertGreen");
    } else if (type === "error") {
      alertElement.classList.add("bg-alertRed");
    }

    alertElement.textContent = message;
    tempatAlert.appendChild(alertElement);

    setTimeout(() => {
      alertElement.style.display = "none";
      tempatAlert.removeChild(alertElement);
    }, duration);
  };

  const validasi = () => {
    if (newPassValue.password !== passValue.password) {
      showAlert("Input Password Salah", "error");
    } else if (newPassValue.password === passValue.password) {
      showAlert("Berhasil Reset Password", "success");
    }
  };
  return (
    <div className=" flex flex-col lg:flex-row w-full min-h-screen">
      {/* Bagian Kiri */}
      <div className="bg-white p-8 lg:p-16 lg:w-2/3 flex items-center justify-center    overflow-hidden">
        <div className="w-full lg:w-2/3 text-black">
          <h1 className="font-bold text-[28px] text-customEmerald01 lg:mb-12 text-left">
            Reset Password
          </h1>

          {/* Reset Password */}
          <div className="mt-2 relative block mb-4 lg:mb-8">
            <br />
            <p className="float-left">Password Baru</p>

            <br />
            <input
              type={newPassValue.showPass ? "text" : "password"}
              name="password"
              id="passInput1"
              placeholder="Password"
              className="float-left border-2 rounded-2xl w-full p-2 text-black"
              value={newPassValue.password}
              onChange={handlePass1}
              required
            />

            <button
              className="absolute right-4 top-14"
              onClick={toggleVisibility1}
            >
              {!newPassValue.showPass ? (
                <PiEye color="grey" size={30} />
              ) : (
                <PiEyeSlash color="grey" size={30} />
              )}
            </button>
          </div>

          {/* PASSWORD */}
          <div className="mt-2 relative block mb-4 lg:mb-8">
            <br />
            <p className="float-left">Ulangi Password Baru</p>

            <br />
            <input
              type={passValue.showPass ? "text" : "password"}
              name="password"
              id="passInput2"
              placeholder="Ulangi Password"
              className="float-left border-2 rounded-2xl w-full p-2 text-black"
              value={passValue.password}
              onChange={handlePass2}
              required
            />

            <button
              className="absolute right-4 top-14"
              onClick={toggleVisibility2}
            >
              {!passValue.showPass ? (
                <PiEye color="grey" size={30} />
              ) : (
                <PiEyeSlash color="grey" size={30} />
              )}
            </button>
          </div>
          <br />
          <br />

          {/* Login button */}
          <button
            className="text-white bg-customEmerald01 rounded-lg w-full p-2"
            onClick={validasi}
          >
            Simpan
          </button>
          <br />

          {/* div kosong buat tempat alert */}
          <div className="tempatAlert fixed bottom-6 lg:bottom-4 lg:left-[33%] left-1/2  transform -translate-x-1/2 flex justify-center items-center w-full lg:w-auto sm:bottom-2 "></div>
        </div>
      </div>

      {/* Bagian Kanan */}
      <div className="bg-customLime01 p-8 lg:p-16 w-full lg:w-[45%] h-[100vh] flex items-center justify-center hidden lg:flex">
        <Link to="/">
          <img
            src="/logo (2).png"
            alt="DemyU Course"
            className="mx-auto w-full"
            width={300}
            height={300}
          />
        </Link>
      </div>
    </div>
  );
};

export default ForgotPass;
