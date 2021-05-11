import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import AddNew from './components/AddNew'
import Persons from './components/Persons'
import personService from './services/personServices'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newSearch, setNewSearch ] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(personList => {
        setPersons(personList)
      })
  }, [])

  const personsToShow = !newSearch
    ? persons
    : persons.filter(person => person.name
      .toLowerCase()
      .includes(newSearch.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()
    const personObject ={
      name: newName,
      number: newNumber
    }
    if (persons.map((person) => person.name)
      .includes(newName)) {
        const message = `${newName} is already in the phonebook. Replace the old number with a new one?`
        if (window.confirm(message)) {
          const oldPerson = persons.find(p => p.name === newName)
          personService
            .replacePerson(personObject, oldPerson.id)
            .then(returnedPerson => {
              setPersons(persons
                .map(person => person.id !== returnedPerson.id ?
                  person : returnedPerson))
            })
        }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleDeletePerson = (id) => () => {
    const personToDelete = persons.find(p => p.id === id)
    if (window.confirm(`Delete the number of ${personToDelete.name}?`)) {
      personService
      .deletePerson(id)
      .then(returnedPerson => {
        setPersons(persons.filter(person => person.id !== id))
      })
    }
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
      <ul style={{listStyleType: 'none', marginLeft: 0, paddingLeft: 0}}>
        <Persons
        list={personsToShow}
        handleDelete={handleDeletePerson}
        />
      </ul>
    </div>
  )
}

export default App