import React from 'react'

const Person = (props) => (
    <li>
        {props.name} {props.number} <button onClick={props.handleDelete}>Delete</button>
    </li>
)

const Persons = (props) => {
    console.log(props.list);
    return (
        props.list.map((person) => (
            <Person
                key={person.id}
                name={person.name}
                number={person.number}
                handleDelete={props.handleDelete(person.id)}
            />
        ))
    )
}

export default Persons