import React from 'react'

const GenreFilter = props => {
  const genres = [...new Set(props.books.map(b => b.genres).flat())]

  return (
    <div>
      <form>
        {genres.map((genre, index) => {
          return (
            <button
              key={index}
              name={genre}
              onClick={event => props.handleFilter(event, event.target.name)}>
              {genre}
            </button>
          )
        })}
        <button onClick={event => props.handleFilter(event, null)}>
          all genres
        </button>
      </form>
    </div>
  )
}

export default GenreFilter
