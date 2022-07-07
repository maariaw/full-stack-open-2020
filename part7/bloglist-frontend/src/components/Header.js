import { StyledHeader } from './styles/Header.styled'
import { StyledTitle } from './styles/Title.styled'
import Navigation from './Navigation'

const Header = ({ user, logout }) => {
  return (
    <StyledHeader>
      <StyledTitle>Blog Share</StyledTitle>
      <Navigation user={user} logout={logout} />
    </StyledHeader>
  )
}

export default Header
