import React, { Component } from 'react';
import { Editor, Viewer } from '@toast-ui/react-editor';
import classNames from 'classnames';
import { createRoot } from 'react-dom/client';

/**
 * Widget function that renders the MarkdownField component defined below.
 *
 * @param container DOM element into which to render the widget
 * @param field Kinetic Field object of the text field that will store the data
 *  from this Markdown editor
 * @param options Object of options to pass through to the MarkdownField component
 */

// TODO: update this entire file
// TODO: remove the toast-ui library?
export const Markdown = (container, field, options) => {
  // TODO validate arguments
  // TODO track any widgets rendered this way and unmount when they are removed
  //  from the dom so you don't end up with orphaned React apps
  createRoot(container).render(<MarkdownField {...options} field={field} />);
};

// Custom component that renders a Markdown Editor and sets any changes into a
// provided Kinetic Field.
class MarkdownField extends Component {
  constructor(props) {
    super(props);
    // Ref so we can get access to the Markdown Editor's value
    this.ref = React.createRef();
    console.log('CONSTRUCT MARKDOWN WIDGET');
  }

  handleChange = () => {
    // On change of the value of the Markdown Editor, also update the Kinetic
    // field value
    this.props.field.value(this.ref.current.getInstance().getMarkdown());
  };

  render() {
    console.log('RENDER MARKDOWN WIDGET');
    const { className, disabled, field, ...editorProps } = this.props;
    // If a disabled prop is passed in, or the Kinetic form
    // is in review mode, a Markdown Viewer is rendered instead.
    const isDisabled =
      typeof disabled !== 'undefined' ? disabled : field.form().reviewMode();
    return (
      <div
        className={classNames(className, {
          'markdown-editor': !isDisabled,
          'markdown-viewer': !!isDisabled,
        })}
      >
        {!isDisabled ? (
          <Editor
            height="auto"
            initialEditType="wysiwyg"
            // Allows you to pass props to the Editor via the options object of
            // the widget function. See the @toast-ui/react-editor Editor
            // component for valid options.
            {...editorProps}
            ref={this.ref}
            initialValue={this.props.field.value() || ''}
            onChange={this.handleChange}
          />
        ) : (
          <Viewer
            height="auto"
            linkAttribute={{
              target: '_blank',
              contenteditable: 'false',
              rel: 'noopener noreferrer',
            }}
            initialValue={this.props.field.value() || ''}
          />
        )}
      </div>
    );
  }
}
