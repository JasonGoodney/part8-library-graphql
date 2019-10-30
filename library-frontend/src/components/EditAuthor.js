import React, { useState } from 'react'
import Select from 'react-select'

const EditAuthor = props => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  if (!props.show || props.result.loading) {
    return null
  }

  const authors = props.result.data.allAuthors

  const submit = event => {
    event.preventDefault()
    props.editAuthor({
      variables: { name, born }
    })

    setName('')
    setBorn('')
    setSelectedOption(null)
  }

  const handleSelect = option => {
    setSelectedOption(option)
    setName(option.value)
  }

  const options = authors.map(a => {
    return { value: a.name, label: a.name }
  })

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          <Select
            value={selectedOption}
            onChange={handleSelect}
            options={options}
          />
        </div>
        <div>
          born
          <input
            value={born}
            type='number'
            onChange={({ target }) => setBorn(parseInt(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default EditAuthor
