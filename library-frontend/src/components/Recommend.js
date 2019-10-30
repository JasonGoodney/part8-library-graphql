import React from 'react'

const Recommend = props => {
  if (!props.show) {
    return null
  }

  const me = props.meQuery.data.me

  const recommendedBooks = props.booksQuery.data.allBooks.filter(b => {
    return b.genres.includes(me.favoriteGenre)
  })

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
