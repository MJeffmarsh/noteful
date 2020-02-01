import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ApiContext from '../ApiContext';
import config from '../config';
import PropTypes from 'prop-types';
import './Note.css';

export default class Note extends React.Component {
  static defaultProps = {
    onDeleteNote: () => {}
  };
  static contextType = ApiContext;

  handleClickDelete = e => {
    e.preventDefault();
    const noteId = this.props.id;

    fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => Promise.reject(e));
        return res.json();
      })
      .then(() => {
        this.context.deleteNote(noteId);
      })
      .then(() => {
        this.props.history.push('/');
      })
      .catch(error => {
        console.error({ error });
      });
  };

  

  render() {
    const { title, id, date_modified } = this.props;
    return (
      <div className='Note'>
        <h2 className='Note__title'>
          <Link to={`/note/${id}`}>{title}</Link>
        </h2>

        <button
          className='Note__delete'
          type='button'
          onClick={this.handleClickDelete}
        >
          <FontAwesomeIcon icon='trash-alt' /> remove
        </button>

        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified{' '}
            <span className='Date'>{format(date_modified, 'Do MMM YYYY')}</span>
            <Link className='Edit' to={`/edit/${id}`}>
              Edit
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

Note.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  date_modified: PropTypes.string.isRequired
};
