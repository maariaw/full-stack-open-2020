import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const StyledNavButton = styled(Link)`
  text-align: center;
  border: 2px solid #8338ec;
  font-family: monospace;
  text-decoration: none;
  font-size: 17px;
  padding: 15px 16px;
  color: darkblue;
  background: #e5d4ed;
  float: left;
  display: block;

  &:visited {
    color: darkblue;
  }

  &:hover {
    background: #eef0f2;
  }
`
