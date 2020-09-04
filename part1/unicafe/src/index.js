import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({ title }) => <h1>{title}</h1>

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const Statistic = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad

  // Don't display anything if no feedback
  if (all === 0) return <p>No feedback given</p>

  const avg = (good - bad) / all
  const pos = 100 * good / all + ' %'

  return (
    <table>
      <tbody>
        <Statistic text='Good:' value={good} />
        <Statistic text='Neutral:' value={neutral} />
        <Statistic text='Bad:' value={bad} />
        <Statistic text='All:' value={all} />
        <Statistic text='Average:' value={avg} />
        <Statistic text='Positive:' value={pos} />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const feedback = 'Please give us feedback!'
  const statistics = 'Statistics'
  const handleClick = (value, setter) => () => {
    setter(value + 1)
  } 

  return (
    <>
      <Header title={feedback}/>
      <div>
        <Button onClick={handleClick(good, setGood)} text='Good' />
        <Button onClick={handleClick(neutral, setNeutral)} text='Neutral' />
        <Button onClick={handleClick(bad, setBad)} text='Bad' />
      </div>
      <Header title={statistics}/>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)