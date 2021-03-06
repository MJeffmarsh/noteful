import React from 'react';
import Note from '../Note/Note';
import ApiContext from '../ApiContext';
import { findNote } from '../notes-helpers';
import './NotePageMain.css';

export default class NotePageMain extends React.Component {
  static defaultProps = {
    match: {
      params: {}
    }
  };
  static contextType = ApiContext;

  handleDeleteNote = noteId => {
    this.props.history.push(`/`);
  };

  render() {
    const { notes = [] } = this.context;
    console.log(notes);
    const { noteId } = this.props.match.params;
    const note = findNote(notes, noteId) || {
      content: '',
      title: '',
      id: 0,
      date_modified: ''
    };

    return (
      <section className='NotePageMain'>
        <Note
          id={note.id}
          title={note.title}
          date_modified={note.date_modified}
          {...this.props}
        />
        <div className='NotePageMain__content'>
          {note.content.split(/\n \r|\n/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>
    );
  }
}
