import React from 'react'
import {Link as RouterLink} from 'react-router-dom'
import styles from './lib.module.css'
import {FaSpinner} from 'react-icons/fa'

function withClassNames(type, styleProps, ...getClassNames) {
  if (!Array.isArray(styleProps)) {
    getClassNames = [styleProps, ...getClassNames]
  }
  function Wrapper(allProps, ref) {
    const {className: classNameProp = '', ...rest} = allProps
    const props = Object.fromEntries(
      Object.entries(rest).filter(([key]) => !styleProps.includes(key)),
    )
    const className = [...getClassNames, classNameProp]
      .flatMap(cn => (typeof cn === 'function' ? cn(allProps) : cn))
      .filter(Boolean)
      .join(' ')
    return React.createElement(type, {
      ref,
      ...props,
      className,
    })
  }
  const typeName =
    (typeof type === 'string' ? type : type.displayName || type.name) ||
    'Unknown'
  Wrapper.displayName = `withClassNames(${typeName})`
  return React.forwardRef(Wrapper)
}

export const CircleButton = withClassNames(
  'button',
  'flex items-center justify-center w-10 h-10 leading-none border border-gray-300 border-solid rounded-full cursor-pointer',
)

export const BookListUL = withClassNames(
  'ul',
  'list-none p-0 grid gap-4',
  styles.bookList,
)

export const Spinner = withClassNames(
  FaSpinner,
  'mx-auto inline',
  styles.spinner,
)
Spinner.defaultProps = {
  'aria-label': 'loading',
}

export const Button = withClassNames(
  'button',
  ['variant'],
  ({variant = 'primary'}) => [
    'px-4 py-3 leading-none border-0',
    buttonVariants[variant],
  ],
)

const buttonVariants = {
  primary: 'bg-primary text-white',
  secondary: 'bg-gray-100 text-gray-800',
}

export const FormGroup = withClassNames('div', 'flex flex-col')

export function FullPageSpinner() {
  return (
    <div className="flex items-center w-full h-screen">
      <Spinner className="text-6xl" />
    </div>
  )
}

export const Link = withClassNames(
  RouterLink,
  'text-primary hover:text-primary-800 hover:underline',
)
