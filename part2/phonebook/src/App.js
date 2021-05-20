import React, { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Filter from './components/Filter'
import AddNew from './components/AddNew'
import Persons from './components/Persons'
import personService from './services/personServices'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newSearch, setNewSearch ] = useState('')
  const [ newMessage, setNewMessage ] = useState(null)
  const [ messageType, setMessageType ] = useState(null)

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
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.map((person) => person.name)
      .includes(newName)) {
        const message = `${newName} is already in the phonebook. ` +
          `Replace the old number with a new one?`
        if (window.confirm(message)) {
          const oldPerson = persons.find(p => p.name === newName)
          personService
            .replacePerson(personObject, oldPerson.id)
            .then(returnedPerson => {
              setPersons(persons
                .map(person => person.id !== returnedPerson.id ?
                  person : returnedPerson))
              setNewName('')
              setNewNumber('')
              setMessageType('success')
              setNewMessage(
                `Edited ${personObject.name}`
              )
              setTimeout(() => {
                setNewMessage(null)
                setMessageType(null)
              }, 4000)
            })
            .catch(error => {
              setMessageType('error')
              if (error.response) {
                setNewMessage(error.response.data.error)
              } else {
                setNewMessage(
                  `Can't edit ${personObject.name} because the contact has ` +
                  `been deleted. Try again to add a new contact.`
                )
                setPersons(persons.filter(person => person.id !== oldPerson.id))
              }
              setTimeout(() => {
                setNewMessage(null)
                setMessageType(null)
              }, 4000)
            })
        }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessageType('success')
          setNewMessage(
            `Added ${personObject.name}`
          )
          setTimeout(() => {
            setNewMessage(null)
            setMessageType(null)
          }, 4000)
        })
        .catch(error => {
          setMessageType('error')
          setNewMessage(`${error.response.data.error}`)
          setTimeout(() => {
            setNewMessage(null)
            setMessageType(null)
          }, 4000)
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
        setMessageType('success')
        setNewMessage(
          `Deleted ${personToDelete.name}`
        )
        setTimeout(() => {
          setNewMessage(null)
          setMessageType(null)
        }, 4000)
      })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchChange = (event) => setNewSearch(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification type={messageType} message={newMessage} />
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