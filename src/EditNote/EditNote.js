import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ApiContext from '../ApiContext';
import config from '../config';
import './EditNote.css';

const Required = () => <span className='EditNote__required'>*</span>;

class EditNote extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object
    }),
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired
  };

  static contextType = ApiContext;

  state = {
    error: null,
    id: '',
    title: '',
    content: ''
  };

  componentDidMount() {
    const { noteId } = this.props.match.params;
    fetch(config.API_ENDPOINT + `/notes/${noteId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) return res.json().then(error => Promise.reject(error));

        return res.json();
      })
      .then(responseData => {
        this.setState({
          id: responseData.id,
          title: responseData.title,
          content: responseData.content
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({ error });
      });
  }

  handleChangeName = e => {
    this.setState({ title: e.target.value });
  };

  handleChangeContent = e => {
    this.setState({ content: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { noteId } = this.props.match.params;
    const { id, title, content } = this.state;
    const newNote = { id, title, content };
    fetch(config.API_ENDPOINT + `notes/${noteId}`, {
      method: 'PATCH',
      body: JSON.stringify(newNote),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) return res.json().then(error => Promise.reject(error));
      })
      .then(() => {
        this.resetFields(newNote);
        this.context.updateNote(newNote);
        this.props.history.push('/');
      })
      .catch(error => {
        console.error(error);
        this.setState({ error });
      });
  };

  resetFields = newFields => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      content: newFields.content || ''
    });
  };

  handleClickCancel = () => {
    this.props.history.push('/');
  };

  render() {
    const { error, title, content } = this.state;
    return (
      <section className='EditNoteForm'>
        <h2>Edit note</h2>
        <form>
          <div className='EditNote__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <input type='hidden' name='id' />
          <div className='EditNoteInput'>
            <label htmlFor='title'>
              Title <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='note name'
              required
              value={title}
              onChange={this.handleChangeName}
            />
          </div>
          <div className='EditNoteInput'>
            <label htmlFor='content'>
              Content <Required />
            </label>
            <input
              type='text'
              name='content'
              id='content'
              placeholder='content'
              required
              value={content}
              onChange={this.handleChangeContent}
            />
          </div>
          <div className='EditNote__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>{' '}
            <button type='submit'>Save</button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditNote;
