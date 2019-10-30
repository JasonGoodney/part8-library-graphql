import React from 'react'
import EditAuthor from './EditAuthor'

const Authors = props => {
  if (props.result.loading) {
    return <div>loading...</div>
  }
  if (!props.show) {
    return null
  }
  const allAuthors = props.result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {allAuthors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditAuthor editAuthor={props.editAuthor} allAuthors={allAuthors} />
    </div>
  )
}

export default Authors
