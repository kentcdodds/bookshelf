import styled from '@emotion/styled/macro'
import {Dialog as ReachDialog} from '@reach/dialog'
import {FaSpinner} from 'react-icons/fa'
import {keyframes} from '@emotion/core'

const spin = keyframes({
  '0%': {transform: 'rotate(0deg)'},
  '100%': {transform: 'rotate(360deg)'}
})
const Spinner = styled(FaSpinner)({
  animation: `${spin} 1s linear infinite`
})
Spinner.defaultProps = {
  'aria-label': 'loading'
}


const Button = styled.button`
  padding: 10px 15px;
  border: 0;
  line-height: 1;
  border-radius: 3px;
  color: ${props => props.variant === 'secondary' ? 'black' : 'white'};
  background: ${props => props.variant === 'secondary' ? 'rgb(241, 242, 247)' : 'rgb(63, 81, 181)'}
`
const Input = styled.input`
  borderRadius: 3px;
  border: 1px solid #f1f1f4;
  background: #f1f2f7;
  padding: 8px 12px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const CircleButton = styled.button({
  borderRadius: '30px',
  padding: '0',
  width: '40px',
  height: '40px',
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'white',
  color: '#434449',
  border: `1px solid #f1f1f4`,
  cursor: 'pointer',
})

const Dialog = styled(ReachDialog)({
  maxWidth: '450px',
  borderRadius: '3px',
  paddingBottom: '3.5em',
  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
  margin: '20vh auto',
  '@media (max-width: 991px)': {
    width: '100%',
    margin: '10vh auto',
  },
})

export {CircleButton, Dialog, Button, FormGroup, Input, Spinner}
