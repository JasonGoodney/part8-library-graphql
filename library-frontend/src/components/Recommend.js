import React, { useState } from 'react'
import { useApolloClient } from '@apollo/react-hooks'

const Recommend = props => {
  const client = useApolloClient(props.recommendedBooksQuery)
  const [recommendedBooks, setRecommendedBooks] = useState([])

  const getBooks = async () => {
    const { data } = await client.query({
      query: props.recommendedBooksQuery,
      variables: { username: props.meQuery.data.me.username }
    })

    setRecommendedBooks(data.recommendedBooks)
  }

  if (
    !props.show ||
    props.recommendedBooksQuery.loading ||
    props.meQuery.loading
  ) {
    return null
  } else {
    getBooks()
  }

  const me = props.meQuery.data.me

  return (
    <div>
      <h2>recommendations</h2>
      {recommendedBooks.length === 0 && 'No '}books in your favorite genre{' '}
      <b>{me.favoriteGenre}</b>
      {recommendedBooks.length !== 0 && (
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {recommendedBooks.map(a => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Recommend
