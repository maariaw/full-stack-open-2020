import React, { useState, useEffect } from 'react';
import axios from 'axios'

const SearchBar = (props) => {
  return (
    <label htmlFor="search">
      Find countries: 
      <input
          id="search"
          value={props.value}
          onChange={props.onChange}
        />
    </label>
  )
}

const CountryFull = ({ country }) => {
  const altText = `Flag of ${country.name}` 
  return (
    <div>
      <h2>{country.name}</h2>
      <p>
        Capital: {country.capital}
        <br />
        Population: {country.population}
      </p>
      <h3>Languages</h3>
      <ul>
        {country.languages.map((language) =>
          <li key={language.name}>{language.name}</li>
        )}
      </ul>
      <img src={country.flag} alt={altText} height="100" width="150" />
      <p>
        Co-ordinates: {country.latlng[0]}, {country.latlng[1]}
      </p>
    </div>
  )
}

const Results = (props) => {
  const countries = props.countries
  if (countries.length === 1) {
    return <CountryFull country={countries[0]} />
  } else if (countries.length < 11) {
    return (
      <div>
        {countries.map((country) =>
          <div key={country.name}>{country.name}<button onClick={props.handleShowClick(country.name)}>show</button></div>)}
      </div>
    )
  } else {
    return <div>Too many matches, specify another filter</div>
  }
}

const App = () => {
  const [ newSearch, setNewSearch ] = useState('')
  const [ countries, setCountries ] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => setNewSearch(event.target.value)

  const handleShowClick = (country) => () => setNewSearch(country)
  
  const countriesToShow = !newSearch
    ? []
    : countries.filter(country => country.name
      .toLowerCase()
      .includes(newSearch.toLowerCase()))

  return (
    <>
      <SearchBar value={newSearch} onChange={handleSearchChange} />
      <Results countries={countriesToShow} handleShowClick={handleShowClick} />
    </>
  )

}

export default App;
