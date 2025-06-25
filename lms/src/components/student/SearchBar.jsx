import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data || '');

  useEffect(() => {
    setInput(data || '');
  }, [data]);

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      navigate(`/course-list/${input}`);
    }
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className="flex justify-center "
    >
      <div className="relative w-full max-w-3xl flex items-center bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        
        {/* Search Icon */}
        <span className="absolute left-4">
          <img src={assets.search_icon} alt="Search" className="w-5 h-5 text-gray-500" />
        </span>

        {/* Input Field */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for courses..."
          className="w-full py-3 pl-12 pr-32 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Search Button */}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
