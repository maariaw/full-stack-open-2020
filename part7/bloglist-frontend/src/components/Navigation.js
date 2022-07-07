import { StyledNavigation } from './styles/Navigation.styled'
import { StyledNavButton } from './styles/NavButton.styled'
import { StyledLogout } from './styles/Logout.styled'
import { StyledLogged } from './styles/Logged.styled'

const Navigation = ({ user, logout }) => {
  return (
    <StyledNavigation>
      <StyledNavButton to='/'>
        <b>BLOGS</b>
      </StyledNavButton>
      <StyledNavButton to='/users'>
        <b>USERS</b>
      </StyledNavButton>
      <StyledLogout>
        {user && <StyledLogged>{user.name} logged in</StyledLogged>}
        <StyledNavButton as='button' onClick={logout}>
          Logout
        </StyledNavButton>
      </StyledLogout>
    </StyledNavigation>
  )
}

export default Navigation
