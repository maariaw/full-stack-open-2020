import { Link } from 'react-router-dom'
import styled from 'styled-components'

const NavBar = styled.div`
  background: lightblue;
  display: flex;
  align-items: center;
  height: 2em;
`

const NavButton = styled(Link)`
  display: flex;
  align-items: center;
  border: 2px solid darkblue;
  font-family: monospace;
  text-decoration: none;
  height: 2em;
  margin: 0em 0.5em;
  padding: 0em 0.5em;
  color: darkblue;

  &:visited {
    color: darkblue;
  }
`

const Navigation = ({ user, logout }) => {
  return (
    <NavBar>
      <NavButton to='/'>
        <b>BLOGS</b>
      </NavButton>
      <NavButton to='/users'>
        <b>USERS</b>
      </NavButton>
      {user && <p>{user.name} logged in</p>}
      <NavButton as='button' onClick={logout}>
        Logout
      </NavButton>
    </NavBar>
  )
}

export default Navigation
