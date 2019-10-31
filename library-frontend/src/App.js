import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import {
  useQuery,
  useMutation,
  useApolloClient,
  useSubscription
} from '@apollo/react-hooks'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import EditAuthor from './components/EditAuthor'
import Recommend from './components/Recommend'

const ADDED_BOOK_DETAILS = gql`
  fragment AddedBookDetails on Book {
    title
    author {
      name
    }
    published
    genres
    id
  }
`

const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    name
    born
    bookCount
    id
  }
`

const ALL_AUTHORS = gql`
  {
    allAuthors {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

const FIND_AUTHOR = gql`
  query findAuthor($name: String!) {
    findAuthor(name: $name) {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
      genres
      id
    }
  }
`

const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      ...AddedBookDetails
    }
  }
  ${ADDED_BOOK_DETAILS}
`

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

const ME = gql`
  {
    me {
      username
      favoriteGenre
    }
  }
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...AddedBookDetails
    }
  }
  ${ADDED_BOOK_DETAILS}
`

const App = () => {
  const client = useApolloClient()
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)

  const notify = message => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const handleError = error => {
    debugger
    setErrorMessage(error.message || error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const authorsQuery = useQuery(ALL_AUTHORS)
  const booksQuery = useQuery(ALL_BOOKS)
  const meQuery = useQuery(ME)

  const [addBook] = useMutation(ADD_BOOK, {
    onError: handleError,
    update: async (store, response) => {
      updateCacheWith(response.data.addBook)
    }
  })

  const [editAuthor] = useMutation(EDIT_AUTHOR)

  const [login] = useMutation(LOGIN, {
    onError: handleError,
    onCompleted: () => setPage('authors')
  })

  const updateCacheWith = async addedBook => {
    const includedIn = (set, object) => set.map(b => b.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })

    if (!includedIn(dataInStore.allBooks, addedBook)) {
      const authorName = addedBook.author.name

      const authorQuery = await client.query({
        query: FIND_AUTHOR,
        variables: { name: authorName }
      })

      if (
        authorQuery.data.findAuthor &&
        !includedIn(dataInStore.allBooks, addedBook)
      ) {
        const author = authorQuery.data.findAuthor

        const book = {
          ...addedBook,
          author: { ...author, bookCount: author.bookCount + 1 || 1 }
        }

        dataInStore.allBooks.push(book)

        client.writeQuery({
          query: ALL_BOOKS,
          data: dataInStore
        })

        const authorDataInStore = client.readQuery({ query: ALL_AUTHORS })
        if (!includedIn(authorDataInStore.allAuthors, author)) {
          authorDataInStore.allAuthors.push(author)
          client.writeQuery({
            query: ALL_AUTHORS,
            data: authorDataInStore
          })
        }
      }
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  const errorNotification = () =>
    errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>

  if (authorsQuery.loading && booksQuery.loading && meQuery.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      {errorNotification()}
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={() => logout()}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>
      <Authors show={page === 'authors'} result={authorsQuery} />
      {token && (
        <EditAuthor
          show={page === 'authors'}
          result={authorsQuery}
          editAuthor={editAuthor}
        />
      )}

      <Books
        show={page === 'books'}
        result={booksQuery}
        showGenres
        allBooksQuery={ALL_BOOKS}
      />

      <NewBook show={page === 'add'} addBook={addBook} />

      <Recommend
        show={page === 'recommend'}
        meQuery={meQuery}
        //favoriteGenre={meQuery.data.me.favoriteGenre}
        booksQuery={booksQuery}
        // recommendedBooks={recommendedBooks}
      />

      <LoginForm show={page === 'login'} login={login} setToken={setToken} />
    </div>
  )
}

export default App
