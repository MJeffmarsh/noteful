import React, { Component } from 'react';
import ApiContext from '../ApiContext';
import config from '../config';
import './AddFolder.css';

class AddFolder extends Component {
  static contextType = ApiContext;

  state = {
    error: null
  };

  handleSubmit = e => {
    e.preventDefault();

    const { name } = e.target;
    const addName = {
      name: name.value
    };

    this.setState({ error: null });

    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      body: JSON.stringify(addName),
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
        this.context.addFolder(data);
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
      <form className='addFolder-form' onSubmit={this.handleSubmit}>
        <h2>Add a folder</h2>
        <div>
          <label htmlFor='name'>Folder name: </label>
          <input type='text' name='name' id='name' required></input>
        </div>
        <button type='button' onClick={this.handleCancel}></button>
        <button type='submit'>Save</button>
      </form>
    );
  }
}

export default AddFolder;
