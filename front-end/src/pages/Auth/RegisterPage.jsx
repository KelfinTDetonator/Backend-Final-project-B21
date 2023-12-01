import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { toastNotify } from "../../libs/utils";

const RegisterPage = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      nama: "",
      email: "",
      nomorTelepon: "",
      password: "",
      konfirmasiPassword: "",
    },
    validationSchema: Yup.object({
      nama: Yup.string().required("Nama harus diisi").min(3, "Minimal 3 huruf"),
      email: Yup.string()
        .email("Email tidak valid")
        .required("Email harus diisi"),
      nomorTelepon: Yup.string()
        .required("Nomor Telepon harus diisi")
        .min(9, "Nomor Telepon tidak valid"),
      password: Yup.string()
        .required("Password harus diisi")
        .min(8, "Password minimal 8 karakter"),
      konfirmasiPassword: Yup.string()
        .required("Konfirmasi Password harus diisi")
        .oneOf([Yup.ref("password"), null], "Password tidak sama"),
    }),
    onSubmit: (values) => {
      console.log(values);
      toastNotify({
        type: "success",
        message: "Berhasil mendaftar",
      });
      navigate("/auth/register/otp");
    },
  });

  return (
    <section className="h-[100vh] w-full grid lg:grid-cols-2 grid-cols-1 ">
      <div className="flex items-start flex-col justify-center w-full lg:px-32 md:px-16 px-5 lg:py-0 py-10 lg:bg-transparent bg-customEmerald01/10">
        <h1 className="font-bold lg:text-4xl text-3xl text-customEmerald01 ">
          Daftar
        </h1>
        <form
          className="w-full flex flex-col gap-4 my-6"
          onSubmit={formik.handleSubmit}
        >
          <label className="form-control w-full relative">
            <div className="label">
              <span
                className={`lg:text-lg text-base font-medium ${
                  formik.errors.nama && formik.touched.nama && "text-red-500"
                }`}
              >
                Nama
              </span>
            </div>
            <input
              type="text"
              placeholder="Nama Lengkap"
              className={`input input-bordered w-full ${
                formik.errors.nama && formik.touched.nama && "input-error"
              }`}
              name="nama"
              value={formik.values.nama}
              onChange={formik.handleChange}
            />
            {formik.errors.nama && formik.touched.nama ? (
              <div className="text-red-500">{formik.errors.nama}</div>
            ) : formik.values.nama && !formik.errors.nama ? (
              <div className="text-green-500 absolute bottom-3 right-3">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
            ) : null}
          </label>

          <label className="form-control w-full relative">
            <div className="label">
              <span
                className={`lg:text-lg text-base font-medium ${
                  formik.errors.email && formik.touched.email && "text-red-500"
                }`}
              >
                Email
              </span>
            </div>
            <input
              type="email"
              placeholder="Contoh: johndee@gmail.com"
              className={`input input-bordered w-full ${
                formik.errors.email && formik.touched.email && "input-error"
              }`}
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.errors.email && formik.touched.email ? (
              <div className="text-red-500">{formik.errors.email}</div>
            ) : formik.values.email && !formik.errors.email ? (
              <div className="text-green-500 absolute bottom-3 right-3">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
            ) : null}
          </label>

          <label className="form-control w-full relative">
            <div className="label">
              <span
                className={`lg:text-lg text-base font-medium ${
                  formik.errors.nomorTelepon &&
                  formik.touched.nomorTelepon &&
                  "text-red-500"
                }`}
              >
                Nomor Telepon
              </span>
            </div>
            <input
              type="text"
              placeholder="Contoh: +62.."
              className={`input input-bordered w-full ${
                formik.errors.nomorTelepon &&
                formik.touched.nomorTelepon &&
                "input-error"
              }`}
              name="nomorTelepon"
              value={formik.values.nomorTelepon}
              onChange={formik.handleChange}
            />
            {formik.errors.nomorTelepon && formik.touched.nomorTelepon ? (
              <div className="text-red-500">{formik.errors.nomorTelepon}</div>
            ) : formik.values.nomorTelepon && !formik.errors.nomorTelepon ? (
              <div className="text-green-500 absolute bottom-3 right-3">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
            ) : null}
          </label>

          <label className="form-control w-full relative">
            <div className="label">
              <span
                className={`lg:text-lg text-base font-medium ${
                  formik.errors.password &&
                  formik.touched.password &&
                  "text-red-500"
                }`}
              >
                Password
              </span>
            </div>
            <input
              type="password"
              placeholder="Masukkan Password"
              className={`input input-bordered w-full ${
                formik.errors.password &&
                formik.touched.password &&
                "input-error"
              }`}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {formik.errors.password && formik.touched.password ? (
              <div className="text-red-500">{formik.errors.password}</div>
            ) : formik.values.password && !formik.errors.password ? (
              <div className="text-green-500 absolute bottom-3 right-3">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
            ) : null}
          </label>

          <label className="form-control w-full relative">
            <div className="label">
              <span
                className={`lg:text-lg text-base font-medium ${
                  formik.errors.konfirmasiPassword &&
                  formik.touched.konfirmasiPassword &&
                  "text-red-500"
                }`}
              >
                Konfirmasi Password
              </span>
            </div>
            <input
              type="password"
              placeholder="Konfirmasi Password"
              className={`input input-bordered w-full ${
                formik.errors.konfirmasiPassword &&
                formik.touched.konfirmasiPassword &&
                "input-error"
              }`}
              name="konfirmasiPassword"
              value={formik.values.konfirmasiPassword}
              onChange={formik.handleChange}
            />
            {formik.errors.konfirmasiPassword &&
            formik.touched.konfirmasiPassword ? (
              <div className="text-red-500">
                {formik.errors.konfirmasiPassword}
              </div>
            ) : formik.values.konfirmasiPassword &&
              !formik.errors.konfirmasiPassword ? (
              <div className="text-green-500 absolute bottom-3 right-3">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
            ) : null}
          </label>

          <button
            type="submit"
            className="btn bg-customEmerald01 text-slate-100 self-center w-full "
          >
            Daftar
          </button>
        </form>
        <p className="font-medium text-center w-full">
          Sudah punya akun?{" "}
          <span className="font-bold text-customGreen01">
            <Link to="/auth/login">Masuk di sini</Link>
          </span>
        </p>
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

export default RegisterPage;
