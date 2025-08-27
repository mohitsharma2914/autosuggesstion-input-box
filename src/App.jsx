import { useState, useEffect, useRef } from "react";

function App() {
  const [searchText, setSearchText] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [result, setResult] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };


  let resCache = useRef({})
  const fetchData = async () => {
    let key = JSON.stringify(searchText)
    if(resCache.current[key]) {
      setResult(resCache.current[key]);
      console.log('return from cache', resCache)
      return resCache.current[key];
    }
    // fetch data if cache is not present
    const data = await fetch(
      `https://dummyjson.com/recipes/search?q=${searchText}`
    );
    const json = await data.json();
    const recepies = json?.recipes;
    // limit the response to the numbers
    // let limit = json?.limit;
    // limit = limit > 6 ? 6: limit
    let res = [];
    res = [...recepies]
    // for (let i = 0; i < limit; i++) {
    //   res.push(recepies[i]);
    // }
    setResult(res);
    resCache.current[key] = res // store in cache
    console.log('store in cache', resCache)
    return res;
  };

  useEffect(() => {
    let timer= setTimeout(fetchData, 300)
    return() => {
      clearTimeout(timer)
    }
  }, [searchText]);

  const handleSuggestionBox = (item) => {
    setSearchText(item); 
    setShowSuggestion(false)
  }

  return (
    <>
      <div className="wrapper">
        <h1 className="main-title">Google Search</h1>
        <div className="search-section">
          <input
            value={searchText}
            placeholder="Search Recepies..."
            autoComplete="off"
            id="search-bar"
            onChange={(e) => handleSearch(e)}
            onBlur={() => {setShowSuggestion(false)}}
            onFocus={() => setShowSuggestion(true)}
          />
          {showSuggestion && (
            <div className="search-suggestions">
              <ul>
                {result?.map((item) => (
                        <li key={item.id} onMouseDown={() => {handleSuggestionBox(item.name)}}>
                          {item.name}
                        </li>
                    ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
