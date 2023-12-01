import { useState } from "react";

import { PiEye } from "react-icons/pi";
import { PiEyeSlash } from "react-icons/pi";
import { Link } from "react-router-dom";

const LoginPage = () => {
  //useState untuk password
  const [passValue, setPassValue] = useState({
    password: "",
    showPass: false,
  });

  //useState untuk Email
  const [Email, setEmail] = useState("");

  //handle onchange password
  const handlePass = (event) => {
    setPassValue({ ...passValue, password: event.target.value });
  };

  //buat ganti dari type password ke type text
  const toggleVisibility = () => {
    setPassValue({ ...passValue, showPass: !passValue.showPass });
  };
  // buat nyobain alert validasi
  const Dummy = {
    Email: "coba1",
    password: "cobaan",
  };
  //function buat bikin alert
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

  const inputEmailMerah = () => {
    const emailInput = document.querySelector("#emailInput");
    emailInput.classList.add("border-red-500");

    setTimeout(() => {
      emailInput.classList.remove("border-red-500");
    }, 5000);
  };
  const inputPassMerah = () => {
    const passInput = document.querySelector("#passInput");
    passInput.classList.add("border-red-500");

    setTimeout(() => {
      passInput.classList.remove("border-red-500");
    }, 5000);
  };
  const validasi = () => {
    if (Email === Dummy.Email && passValue.password !== Dummy.password) {
      inputPassMerah();
      showAlert("Maaf kata sandi salah", "error");
    } else if (Email === Dummy.Email && passValue.password === Dummy.password) {
      showAlert("Berhasil masuk", "success");
    } else if (Email !== Dummy.Email && passValue.password === Dummy.password) {
      inputEmailMerah();
      showAlert("Alamat email tidak terdaftar!", "error");
    } else if (Email === "" && passValue.password === "") {
      showAlert("email dan kata sandi tidak boleh kosong", "error");
      inputEmailMerah();
      inputPassMerah();
    } else {
      showAlert("Maaf kata sandi salah atau email tidak terdaftar", "error");
      inputEmailMerah();
      inputPassMerah();
    }
  };
  return (
    <div className=" flex flex-col lg:flex-row w-full min-h-screen">
      {/* Bagian Kiri */}
      <div className="bg-white p-8 lg:p-16 lg:w-2/3 flex items-center justify-center    overflow-hidden">
        <div className="w-full lg:w-2/3 text-black">
          <h1 className="font-bold text-[28px] text-customEmerald01 lg:mb-12 text-left">
            Masuk
          </h1>

          {/* Email/No telp */}
          <div className="mb-4 lg:mb-8">
            <p className="float-left">Email/No Telpon</p>
            <br />
            <input
              type="text"
              name="Email"
              placeholder="Contoh: johndoe@gmail.com"
              id="emailInput"
              className="emailInput float-left  border-2 rounded-2xl w-full p-2 text-black"
              value={Email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mt-2 relative block mb-4 lg:mb-8">
            <br />
            <p className="float-left">Password</p>

            <p className="float-right">
              <Link to="/auth/otp" className="text-customGreen01 font-medium">
                Lupa Kata Sandi
              </Link>
            </p>
            <br />
            <input
              type={passValue.showPass ? "text" : "password"}
              name="password"
              id="passInput"
              placeholder="Password"
              className="float-left border-2 rounded-2xl w-full p-2 text-black"
              value={passValue.password}
              onChange={handlePass}
              required
            />

            <button
              className="absolute right-4 top-14"
              onClick={toggleVisibility}
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
            Masuk
          </button>
          <br />

          <p className="text-black items-center text-center mt-6">
            Belum punya akun?{" "}
            <Link to="/auth/register" className="text-customGreen01 font-bold">
              Daftar di sini
            </Link>
          </p>

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

export default LoginPage;
