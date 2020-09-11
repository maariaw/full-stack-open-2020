import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import AddNew from './components/AddNew'
import Persons from './components/Persons'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newSearch, setNewSearch ] = useState('')

  useEffect(() => {
    console.log('effect happening');
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled');
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons');

  const personsToShow = !newSearch
    ? persons
    : persons.filter(person => person.name
      .toLowerCase()
      .includes(newSearch.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map((person) => person.name)
      .includes(newName)) {
        window.alert(`${newName} is already in the phonebook`)
        return
      }
    const personObject ={
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchChange = (event) => setNewSearch(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newSearch} onChange={handleSearchChange} />
      <h3>Add new</h3>
      <AddNew
        onFormSubmit={addPerson}
        nameValue={newName}
        onNameChange={handleNameChange}
        numberValue={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons list={personsToShow} />
    </div>
  )
}

export default App