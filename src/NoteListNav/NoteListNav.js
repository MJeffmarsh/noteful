import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircleButton from '../CircleButton/CircleButton';
import ApiContext from '../ApiContext';
import config from '../config';
import { countNotesForFolder, findFolder } from '../notes-helpers';
import './NoteListNav.css';

export default class NoteListNav extends React.Component {
  static contextType = ApiContext;

  handleClickDelete = e => {
    const { folders = [] } = this.context;

    const folder = findFolder(folders, e.target.id) || {};
    const folderId = folder.id;
    e.preventDefault();

    console.log(folderId);

    fetch(`${config.API_ENDPOINT}/folders/${folderId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => Promise.reject(e));
        return true;
      })
      .then(() => {
        this.context.deleteFolder(folderId);

        this.props.history.push('/');
      })
      .catch(error => {
        console.error({ error });
      });
  };

  render() {
    const { folders = [], notes = [] } = this.context;
    return (
      <div className='NoteListNav'>
        <ul className='NoteListNav__list'>
          {folders.map(folder => (
            <li key={folder.id}>
              <NavLink
                className='NoteListNav__folder-link'
                to={`/folder/${folder.id}`}
              >
                <span className='NoteListNav__num-notes'>
                  {countNotesForFolder(notes, folder.id)}
                </span>
                <button
                  className='Folder__delete'
                  type='button'
                  onClick={this.handleClickDelete}
                >
                  X
                  <FontAwesomeIcon icon='trash-alt' />
                </button>
                {folder.title}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className='NoteListNav__button-wrapper'>
          <CircleButton
            tag={Link}
            to='/add-folder'
            type='button'
            className='NoteListNav__add-folder-button'
          >
            <FontAwesomeIcon icon='plus' />
            <br />
            Folder
          </CircleButton>
        </div>
      </div>
    );
  }
}
