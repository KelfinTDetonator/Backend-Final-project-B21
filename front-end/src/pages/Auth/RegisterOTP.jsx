/* eslint-disable react-hooks/rules-of-hooks */
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import { toastNotify } from "../../libs/utils";

const RegisterOTP = () => {
  const otpRefs = Array.from({ length: 6 }).map(() => useRef());

  const formik = useFormik({
    initialValues: {
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: "",
      otp6: "",
    },
    validationSchema: Yup.object({
      otp1: Yup.string().required("OTP harus diisi"),
      otp2: Yup.string().required("OTP harus diisi"),
      otp3: Yup.string().required("OTP harus diisi"),
      otp4: Yup.string().required("OTP harus diisi"),
      otp5: Yup.string().required("OTP harus diisi"),
      otp6: Yup.string().required("OTP harus diisi"),
    }),
    onSubmit: (values) => {
      const otp = Object.values(values).join("");
      toastNotify({
        type: "success",
        message: `Kode OTP ${otp}`,
      });
    },
  });

  const handleOTPChange = (e, index) => {
    formik.handleChange(e);

    if (e.target.value.length === 1) {
      if (index < otpRefs.length - 1) {
        otpRefs[index + 1].current.focus();
      } else {
        formik.handleSubmit();
      }
    }
  };

  return (
    <section className="h-[100vh] w-full grid lg:grid-cols-2 grid-cols-1 ">
      <div className="flex items-center flex-col justify-center w-full lg:px-32 md:px-16 px-5 lg:py-0 py-10 lg:bg-transparent bg-customEmerald01/10">
        <h1 className="font-bold lg:text-4xl text-3xl text-customEmerald01">
          Masukkan OTP
        </h1>
        <form
          className="w-full flex flex-col gap-4 my-6"
          onSubmit={formik.handleSubmit}
        >
          <label className="form-control w-full relative">
            <div className="label py-12 text-center">
              <span className="text-sm text-center w-full font-medium">
                Ketik 6 digit kode yang dikirimkan ke{" "}
                <span className="font-bold">J*****@gmail.com</span>
              </span>
            </div>
            <div className="grid grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  ref={otpRefs[i]}
                  className="font-bold w-[50px] bg-customLime01 pl-5 p-3 border border-customGreen01 focus:border-customGreen01 focus:ring-2 focus:ring-customGreen01 focus:outline-none rounded-2xl"
                  name={`otp${i + 1}`}
                  value={formik.values[`otp${i + 1}`]}
                  onChange={(e) => handleOTPChange(e, i)}
                  maxLength={1}
                />
              ))}
            </div>
          </label>
          {formik.errors && formik.touched && (
            <div className="text-red-500 text-center">
              {formik.errors.otp1 ||
                formik.errors.otp2 ||
                formik.errors.otp3 ||
                formik.errors.otp4 ||
                formik.errors.otp5 ||
                formik.errors.otp6}
            </div>
          )}

          <p className="text-sm w-full text-center font-medium mt-6 mb-12">
            Kirim Ulang OTP dalam 60 detik
          </p>
          <button
            type="submit"
            className="btn bg-customEmerald01 text-slate-100 self-center w-full"
          >
            Simpan
          </button>
        </form>
      </div>

      <div className="bg-customLime01 h-full w-full relative lg:block hidden">
        <Link to="/">
          <img
            src="/logo (2).png"
            alt="DemyU Course"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </Link>
      </div>
    </section>
  );
};

export default RegisterOTP;
