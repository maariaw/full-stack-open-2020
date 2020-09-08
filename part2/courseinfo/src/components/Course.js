import React from 'react'

const CourseHeader = ({ course }) => <h2>{course.name}</h2>

const Total = ({ course }) => {
  console.log('Sum works');
  const sum = course.parts.reduce((sum, part) => sum + part.exercises, 0)
  return(
    <p><strong>Total of {sum} excercises</strong></p>
  ) 
}

const Part = (props) => {
  console.log('Parts working');
  return (
    <p>
      {props.name} {props.exercises}
    </p>    
  )
}

const Content = ({ course }) => {
  console.log('Content working');
  return (
    <div>
      {course.parts.map(part =>
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      )}
    </div>
  )
}

const Course = ({ course }) => {
  console.log('Course working');
  return (
    <div>
      <CourseHeader course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default Course