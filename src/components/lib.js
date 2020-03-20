/** @jsx jsx */
import {jsx} from '@emotion/core'

import {Link as RouterLink} from 'react-router-dom'
import styled from '@emotion/styled/macro'
import {keyframes} from '@emotion/core'
import * as colors from '../styles/colors'
import {FaSpinner} from 'react-icons/fa'

const spin = keyframes({
  '0%': {transform: 'rotate(0deg)'},
  '100%': {transform: 'rotate(360deg)'},
})

export const CircleButton = styled.button({
  borderRadius: '30px',
  padding: '0',
  width: '40px',
  height: '40px',
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: colors.base,
  color: colors.text,
  border: `1px solid ${colors.gray10}`,
  cursor: 'pointer',
})

export const BookListUL = styled.ul({
  listStyle: 'none',
  padding: '0',
  display: 'grid',
  gridTemplateRows: 'repeat(auto-fill, minmax(100px, 1fr))',
  gridGap: '1em',
})

export function Spinner(props) {
  return (
    <FaSpinner
      css={{animation: `${spin} 1s linear infinite`}}
      aria-label="loading"
      {...props}
    />
  )
}

const buttonVariants = {
  primary: {
    background: colors.indigo,
    color: colors.base,
  },
  secondary: {
    background: colors.gray,
    color: colors.text,
  },
}
export const Button = styled.button(
  {
    padding: '10px 15px',
    border: '0',
    lineHeight: '1',
  },
  ({variant = 'primary'}) => buttonVariants[variant],
)

export const FormGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

export function FullPageSpinner() {
  return (
    <div
      css={{
        fontSize: '4em',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spinner />
    </div>
  )
}

export const Link = styled(RouterLink)({
  color: colors.indigo,
  ':hover': {
    color: colors.indigoDarken10,
    textDecoration: 'underline',
  },
})
