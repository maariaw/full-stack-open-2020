import React from 'react'

const Person = (props) => (
    <>
        {props.name} {props.number}
        <br />
    </>
)

const Persons = (props) => {
    console.log(props.list);
    return (
        props.list.map((person) => (
            <Person key={person.name}
                name={person.name}
                number={person.number}
            />
        ))
    )
}

export default Persons