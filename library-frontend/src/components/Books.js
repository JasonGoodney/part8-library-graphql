import React, { useState, useEffect } from 'react'
import GenreFilter from './GenreFilter'
import { useApolloClient } from '@apollo/react-hooks'

const Books = ({ show, result, showGenres, allBooksQuery }) => {
  const client = useApolloClient(allBooksQuery)
  const [filteredBooks, setFilteredBooks] = useState([])
  const [genre, setGenre] = useState(null)

  useEffect(() => {
    const setBooks = async genre => {
      const { data } = await client.query({
        query: allBooksQuery,
        variables: genre ? { genre: genre } : {}
      })
      setFilteredBooks(data.allBooks)
    }

    setBooks(genre)
  }, [allBooksQuery, client, genre])

  if (result.loading) {
    return null
  }

  if (!show) {
    return null
  }

  const handleFilter = async (event, genre) => {
    event.preventDefault()
    setGenre(genre)
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a, i) => (
            <tr key={a.title}>
              <td>{i + 1}</td>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showGenres && (
        <GenreFilter books={result.data.allBooks} handleFilter={handleFilter} />
      )}
    </div>
  )
}

export default Books
