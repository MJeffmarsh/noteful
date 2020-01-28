import React, { Component } from 'react';
import config from '../config';
import ApiContext from '../ApiContext';
import './AddNote.css';

class AddNote extends Component {
  static contextType = ApiContext;

  state = {
    error: null
  };

  handleSubmit = e => {
    e.preventDefault();
    const currentDt = new Date();
    const mm = currentDt.getMonth() + 1;
    const dd = currentDt.getDate();
    const yyyy = currentDt.getFullYear();
    const date = mm + '/' + dd + '/' + yyyy;
    const { name, content, addToFolder } = e.target;
    const newNote = {
      title: name.value,
      content: content.value,
      folderId: addToFolder.value,
      date_modified: date
    };

    this.setState({ error: null });

    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      body: JSON.stringify(newNote),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => {
            throw error;
          });
        }
        return res.json();
      })
      .then(data => {
        name.value = '';
        content.value = '';
        this.context.addNote(data);
        this.props.history.push('/');
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  handleCancel = () => {
    this.props.history.push('/');
  };

  render() {
    return (
      <form className='addNote-form' onSubmit={this.handleSubmit}>
        <h2>Add a note</h2>

        <div className='addNote-input'>
          <label htmlFor='name'>Name:</label>
          <input type='text' name='name' id='name' required />
        </div>

        <div className='addNote-input'>
          <label htmlFor='content'>Content</label>
          <textarea name='content' id='content' />
        </div>

        <div className='addNote-input'>
          <label htmlFor='addToFolder'>Folder name</label>
          <select name='addToFolder' id='addToFolder' required>
            {this.context.folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.title}
              </option>
            ))}
          </select>
        </div>

        <div className='addNote-btn'>
          <button onClick={this.handleCancel}>Cancel</button>

          <button type='submit'>Save</button>
        </div>
      </form>
    );
  }
}

export default AddNote;
