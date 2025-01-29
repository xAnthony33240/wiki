import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    if (value.length >= 2) {
      const results = onSearch(value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form 
        className={`search-bar ${isFocused ? 'focused' : ''}`}
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Rechercher dans le wiki..."
          aria-label="Rechercher"
        />
        <button type="submit" aria-label="Lancer la recherche">
          🔍
        </button>
      </form>

      {isFocused && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((result) => (
            <Link
              key={result.slug}
              to={`/article/${result.slug}`}
              className="search-result-item"
              onClick={() => {
                setQuery('');
                setIsFocused(false);
                setSearchResults([]);
              }}
            >
              <span className="search-result-icon">📄</span>
              <div className="search-result-content">
                <span className="search-result-title">{result.title}</span>
                {result.content && (
                  <span className="search-result-excerpt">
                    {result.content.substring(0, 100).replace(/<[^>]*>/g, '')}...
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
