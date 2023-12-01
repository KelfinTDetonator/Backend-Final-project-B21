const CourseCard = () => {
  return (
    <>
      {/*<!-- Component: Basic blog card --> */}
      <div className="w-2/5 lg:w-1/4 overflow-hidden rounded bg-white text-slate-500 shadow-md shadow-slate-200">
        {/*  <!-- Image --> */}
        <figure>
          <img
            src="https://picsum.photos/id/101/800/600"
            alt="card image"
            className="aspect-video w-full"
          />
        </figure>
        {/*  <!-- Body--> */}
        <div className="p-6">
          <header className="mb-4">
            <div className="flex">
              <h3 className="text-xl font-bold text-slate-700">UI/UX Design</h3>
              <p className="ms-auto">⭐ 4.7</p>
            </div>
            <p className="text-md font-normal text-slate-700">
              Belajar Web Designer dengan Figma
            </p>
            <p className="text-sm text-slate-400"> By Angela Doe</p>
          </header>
          <div className="flex justify-between">
            <p>💡Intermediate level</p>
            <p>🧾5 Modul</p>
            <p>⏳140 Menit</p>
          </div>

          {/*<!-- Component: Small primary button with leading icon  --> */}
          <button className="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-emerald-500 px-4 text-xs font-medium tracking-wide text-white transition duration-300 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none">
            <span className="order-2">Beli</span>
            <span className="order-3 ms-auto ps-3">Rp. 249.000</span>
            <span className="relative only:-mx-4">💎</span>
          </button>
          {/*<!-- End Small primary button with leading icon  --> */}
        </div>
      </div>
      {/*<!-- End Basic blog card --> */}
    </>
  );
};

export default CourseCard;
