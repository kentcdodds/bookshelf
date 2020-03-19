/** @jsx jsx */
import {jsx} from '@emotion/core'

import React from 'react'
import tw from 'twin.macro'
import {
  Routes,
  Route,
  Link as RouterLink,
  useNavigate,
  useMatch,
} from 'react-router-dom'
import {useAuth} from './context/auth-context'
import ReadingListScreen from './screens/list'
import FinishedBooksScreen from './screens/finished'
import DiscoverBooksScreen from './screens/discover'
import BookScreen from './screens/book'
import NotFound from './screens/not-found'

function AuthenticatedApp() {
  const {user, logout} = useAuth()
  return (
    <>
      <div css={tw`absolute top-0 right-0 flex items-center mt-3 mr-5`}>
        {user.username}
        <button
          css={tw`px-3 py-2 ml-4 border border-gray-300 border-solid`}
          onClick={logout}
        >
          Logout
        </button>
      </div>
      <div
        css={tw`grid w-full max-w-4xl grid-cols-none gap-4 px-6 mx-auto my-0 mt-20 md:grid-cols-4 md:grid-rows-none`}
      >
        <div css={tw`col-span-4 md:col-span-1`}>
          <Nav />
        </div>
        <main css={tw`w-full col-span-4 md:col-span-3`}>
          <AppRoutes />
        </main>
        <footer />
      </div>
    </>
  )
}

function NavLink(props) {
  const match = useMatch(props.to)
  return (
    <RouterLink
      css={[
        tw`block w-full h-full px-3 py-2 mx-0 my-2 text-gray-800 border-l-4 border-transparent rounded-sm hover:text-primary hover:no-underline hover:bg-gray-300`,
        match ? tw`bg-gray-300 border-l-4 border-primary` : null,
      ]}
      {...props}
    />
  )
}

function Nav(params) {
  return (
    <nav
      css={tw`sticky top-0 p-4 border border-gray-300 rounded-sm sm:p-3 sm:static`}
    >
      <ul css={tw`p-0 list-none`}>
        <li>
          <NavLink to="/list">Reading List</NavLink>
        </li>
        <li>
          <NavLink to="/finished">Finished Books</NavLink>
        </li>
        <li>
          <NavLink to="/discover">Discover</NavLink>
        </li>
      </ul>
    </nav>
  )
}

function RedirectHome() {
  const navigate = useNavigate()
  React.useEffect(() => {
    navigate('/list', {replace: true})
  }, [navigate])
  return null
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RedirectHome />} />
      <Route path="/list" element={<ReadingListScreen />} />
      <Route path="/finished" element={<FinishedBooksScreen />} />
      <Route path="/discover" element={<DiscoverBooksScreen />} />
      <Route path="/book/:bookId" element={<BookScreen />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AuthenticatedApp
