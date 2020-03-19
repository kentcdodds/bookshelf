/** @jsx jsx */
import {jsx} from '@emotion/core'

import tw from 'twin.macro'
import styled from '@emotion/styled/macro'
import {keyframes} from '@emotion/core'
import {Link as RouterLink} from 'react-router-dom'
import {FaSpinner} from 'react-icons/fa'

export const CircleButton = styled.button(
  tw`flex items-center justify-center w-10 h-10 leading-none text-gray-800 border border-gray-300 border-solid rounded-full cursor-pointer`,
)

export const BookListUL = styled.ul(
  tw`grid gap-4 p-0 list-none`,
  `grid-template-rows: repeat(auto-fill, minmax(100px, 1fr))`,
)

const spin = keyframes({
  '0%': {transform: 'rotate(0deg)'},
  '100%': {transform: 'rotate(360deg)'},
})

export const Spinner = styled(FaSpinner)(tw`inline mx-auto`, {
  animation: `${spin} 1s linear infinite`,
})
Spinner.defaultProps = {
  'aria-label': 'loading',
}

const buttonVariants = {
  primary: tw`text-white bg-primary`,
  secondary: tw`text-gray-800 bg-gray-100`,
}

export const Button = styled.button(
  tw`px-4 py-3 leading-none border-0`,
  ({variant = 'primary'}) => buttonVariants[variant],
)

export const FormGroup = styled.div(tw`flex flex-col`)

export function FullPageSpinner() {
  return (
    <div css={tw`flex items-center w-full h-screen`}>
      <Spinner css={tw`text-6xl`} />
    </div>
  )
}

export const Link = styled(RouterLink)(
  tw`text-primary hover:text-primary-800 hover:underline`,
)
