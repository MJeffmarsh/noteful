import React, { Component } from 'react';
import config from '../config';
import ApiContext from '../ApiContext';
import { format } from 'date-fns';
import './AddNote.css';

export class AddNote extends Component {
  static contextType = ApiContext;

  state = {
    error: null
  };

  handleSubmit = e => {
    const date = format(new Date(), 'MM/dd/yyyy');
    const { name, content, addToFolder } = e.target;
    const newNote = {
      name: name.value,
      content: content.value,
      folderId: addToFolder.value,
      modified: date
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
          <select name='addToFolder' id='addToFolder'>
            {this.context.folders.map(folder => (
              <option value={folder.id}>{folder.name}</option>
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
