import { useState } from "react";
import PropTypes from "prop-types";
import { FaSearch } from "react-icons/fa";

const FilterSection = ({ title, options, handleCheckboxChange }) => (
  <div className="container p-1 rounded" style={{ marginTop: "20px" }}>
    <h4 className="text-lg font-semibold mb-2">{title}</h4>
    {options.map((option) => (
      <div key={option.label} className="flex items-center mb-2 p-2 rounded">
        <input
          type="checkbox"
          className="form-checkbox text-blue-500 mr-2"
          id={option.label}
          checked={option.checked}
          onChange={() => handleCheckboxChange(title, option.label)}
        />
        <label htmlFor={option.label} className="text-sm">
          {option.label}
        </label>
      </div>
    ))}
  </div>
);

const Kelas = () => {
  const initialFilterOptions = [
    {
      title: "Filter",
      options: [
        { label: "Paling Baru", checked: false },
        { label: "Paling Populer", checked: false },
        { label: "Promo", checked: false },
      ],
    },
    {
      title: "Kategori",
      options: [
        { label: "UI/UX Design", checked: false },
        { label: "Web Development", checked: false },
        { label: "Android Development", checked: false },
        { label: "Data Science", checked: false },
        { label: "Business Intelligence", checked: false },
      ],
    },
    {
      title: "Level Kesulitan",
      options: [
        { label: "Beginner Level", checked: false },
        { label: "Intermediate Level 1", checked: false },
        { label: "Advance Level", checked: false },
      ],
    },
  ];

  const [filterOptions, setFilterOptions] = useState(initialFilterOptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleCheckboxChange = (sectionTitle, optionLabel) => {
    setFilterOptions((prevOptions) =>
      prevOptions.map((section) =>
        section.title === sectionTitle
          ? {
              ...section,
              options: section.options.map((option) =>
                option.label === optionLabel
                  ? { ...option, checked: !option.checked }
                  : sectionTitle === "Filter"
                  ? { ...option, checked: false }
                  : option
              ),
            }
          : section
      )
    );
  };

  // cari by query
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // mereset filter
  const resetFilters = () => {
    setFilterOptions(initialFilterOptions);
  };

  const handleDeleteFilter = () => {
    resetFilters();
  };

  const handleClassAll = () => {
    setSelectedFilter("All");
  };

  const handleClassPremium = () => {
    setSelectedFilter("Premium");
  };

  const handleClassFree = () => {
    setSelectedFilter("Gratis");
  };

  const kelas = [
    {
      title: "UI/UX Design",
      rating: 4.7,
      description: "Belajar Web Designer dengan Figma",
      instructor: "Angela Doe",
      level: "Intermediate level",
      modules: 5,
      duration: "140 Menit",
      type: "Premium",
      image:
        "https://minervainfotech.com/blog/wp-content/uploads/2019/09/Untitled-6-1920x1280.jpg",
    },
    {
      title: "Membuat Wireframe Hingga ke Visual Design",
      rating: 4.7,
      description: "Belajar Web Designer dengan Figma",
      instructor: "Angela Doe",
      level: "Intermediate level",
      modules: 5,
      duration: "140 Menit",
      type: "Premium",
      image:
        "https://minervainfotech.com/blog/wp-content/uploads/2019/09/Untitled-6-1920x1280.jpg",
    },
    {
      title: "Data Science",
      rating: 4.5,
      description: "Dasar Pemrograman Python",
      instructor: "James Doe",
      level: "Intermediate level",
      modules: 5,
      duration: "90 Menit",
      type: "Premium",
      image: "https://miro.medium.com/max/1400/1*9bBtkVerj_gJsbaicD_MuQ.png",
    },
    {
      title: "UI/UX",
      rating: 4.7,
      description: "Belajar Design dengan Figma",
      instructor: "Angela Doe",
      level: "Intermediate level",
      modules: 10,
      duration: "120 Menit",
      type: "Premium",
      image:
        "https://minervainfotech.com/blog/wp-content/uploads/2019/09/Untitled-6-1920x1280.jpg",
    },
  ];

  const filteredClasses = kelas.filter((kelas) => {
    // filter by kelas & kategori yg dipilih
    const isCategorySelected = filterOptions[1].options.some(
      (category) => category.checked
    );

    // filter by kategori yg dipilih
    if (isCategorySelected) {
      const selectedCategories = filterOptions[1].options
        .filter((category) => category.checked)
        .map((category) => category.label.toLowerCase());

      return selectedCategories.includes(kelas.title.toLowerCase());
    }

    // filter by kelas Premium/Gratis sesuai selectedFilter
    if (selectedFilter === "All") {
      return true;
    }

    if (selectedFilter === "Premium" && kelas.type === "Premium") {
      return true;
    }

    if (selectedFilter === "Gratis" && kelas.type !== "Premium") {
      return true;
    }

    return false;
  });

  return (
    <div className="bg-white text-white">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row">
        <div
          className="lg:w-1/4 overflow-hidden rounded bg-lime-100 text-black mr-4"
          style={{ marginTop: "80px" }}
        >
          <div className="container mx-auto p-4 flex flex-col space-y-4">
            {filterOptions.map((filter) => (
              <FilterSection
                key={filter.title}
                {...filter}
                handleCheckboxChange={handleCheckboxChange}
              />
            ))}
            <button
              onClick={handleDeleteFilter}
              className="text-sm font-semibold leading-6 text-red-500"
            >
              Hapus Filter
            </button>
          </div>
        </div>

        <div className="container mx-auto p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="self-start">
              <div className="text-3xl font-bold text-black mb-2">
                Topik Kelas
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Cari kelas..."
                className="p-2 rounded border border-gray-300 text-black"
              />
              <div className="ml-2">
                <FaSearch />
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={handleClassAll}
              className="inline-flex h-12 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full bg-emerald-50 px-6 text-sm font-medium tracking-wide text-black transition duration-300 hover:bg-blue-400 hover:text-blue-600 focus:bg-blue-500 focus:text-blue-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-blue-700 disabled:bg-blue-500 disabled:text-blue-500 disabled:shadow-none"
            >
              <span>All</span>
            </button>
            <button
              onClick={handleClassPremium}
              className="inline-flex h-12 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full bg-emerald-50 px-6 text-sm font-medium tracking-wide text-black transition duration-300 hover:bg-blue-400 hover:text-blue-600 focus:bg-blue-500 focus:text-blue-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-blue-700 disabled:bg-blue-500 disabled:text-blue-500 disabled:shadow-none"
            >
              <span>Kelas Premium</span>
            </button>
            <button
              onClick={handleClassFree}
              className="inline-flex h-12 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full bg-emerald-50 px-6 text-sm font-medium tracking-wide text-black transition duration-300 hover:bg-blue-400 hover:text-blue-600 focus:bg-blue-500 focus:text-blue-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-blue-700 disabled:bg-blue-500 disabled:text-blue-500 disabled:shadow-none"
            >
              <span>Kelas Gratis</span>
            </button>
          </div>

          <div className="flex flex-wrap justify-around">
            {filteredClasses.map((kelas, index) => (
              <div
                key={index}
                className="w-full lg:w-2/5 mb-8 overflow-hidden rounded bg-white text-slate-500 shadow-md shadow-slate-200"
              >
                <figure>
                  <img
                    src={kelas.image}
                    alt="card image"
                    className="aspect-video w-full"
                  />
                </figure>

                <div className="p-6">
                  <header className="mb-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-slate-700">
                        {kelas.title}
                      </h3>
                      <p className="text-slate-500">⭐ {kelas.rating}</p>
                    </div>
                    <p className="text-md font-normal text-slate-700">
                      {kelas.description}
                    </p>
                    <p className="text-sm text-slate-400">
                      {" "}
                      By {kelas.instructor}
                    </p>
                  </header>
                  <div className="flex justify-between">
                    <p>💡{kelas.level}</p>
                    <p>🧾{kelas.modules} Modul</p>
                    <p>⏳{kelas.duration}</p>
                  </div>

                  <button className="inline-flex m-3 h-8 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-emerald-500 px-4 text-xs font-medium tracking-wide text-white transition duration-300 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:text-blue-500 disabled:shadow-none">
                    <span className="order-2">{kelas.type}</span>
                    <span className="relative only:-mx-4">💎</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

FilterSection.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      checked: PropTypes.bool.isRequired,
    })
  ).isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
};

export default Kelas;
