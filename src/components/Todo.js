import React from 'react';
import {
  View,
  Switch,
  StyleSheet,
} from 'react-native';
import Relay from 'react-relay';

import ChangeTodoStatusMutation from '../mutations/ChangeTodoStatusMutation';
import RemoveTodoMutation from '../mutations/RemoveTodoMutation';
import RenameTodoMutation from '../mutations/RenameTodoMutation';

import TextButton from './TextButton';
import TodoTextInput from './TodoTextInput';


const styles = StyleSheet.create({
  box: {
    padding: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  complete: {
    backgroundColor: '#eee',
  },
  toggle: {
  },
  text: {
    flex: 1,
    paddingLeft: 8,
  },
  completeText: {
    color: '#999',
  },
  destroy: {
    backgroundColor: 'red',
    padding: 8,
    paddingVertical: 4,
    borderRadius: 3,
    margin: 2,
  },
  destroyText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
});

class Todo extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    todo: React.PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isEditing: false
    };
  }

  onCompleteChange(complete) {
    const { viewer, todo } = this.props;

    Relay.Store.commitUpdate(
      new ChangeTodoStatusMutation({ viewer, todo, complete })
    );
  };

  onDestroyClick() {
    this.removeTodo();
  };

  onLabelDoubleClick() {
    this.setEditMode(true);
  };

  onTextInputCancel() {
    this.setEditMode(false);
  };

  onTextInputDelete() {
    this.setEditMode(false);
    this.removeTodo();
  };

  onTextInputSave(text) {
    const { todo } = this.props;

    this.setEditMode(false);
    Relay.Store.commitUpdate(
      new RenameTodoMutation({ todo, text })
    );
  };

  setEditMode(isEditing) {
    this.setState({ isEditing });
  }

  removeTodo() {
    const { viewer, todo } = this.props;

    Relay.Store.commitUpdate(
      new RemoveTodoMutation({ viewer, todo })
    );
  }

  renderTextInput() {
    if (!this.state.isEditing) {
      return null;
    }

    return (
      <TodoTextInput
        commitOnBlur
        initialValue={this.props.todo.text}
        onCancel={this.onTextInputCancel.bind(this)}
        onDelete={this.onTextInputDelete.bind(this)}
        onSave={this.onTextInputSave.bind(this)}
      />
    );
  }

  render() {
    const { complete, text } = this.props.todo;
    const { isEditing } = this.state;

    if (isEditing) {
      return this.renderTextInput();
    }

    return (
      <View style={[styles.box, complete && styles.complete]}>
        <Switch
          value={complete}
          style={styles.toggle}
          onValueChange={this.onCompleteChange.bind(this)}
        />
        <TextButton
          style={styles.text}
          textStyle={complete && styles.completeText}
          onPress={this.onLabelDoubleClick.bind(this)}
          text={text}
        />
        <TextButton
          style={styles.destroy}
          textStyle={styles.destroyText}
          onPress={this.onDestroyClick.bind(this)}
          text="Delete"
        />
      </View>
    );
  }
}

export default Relay.createContainer(Todo, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${ChangeTodoStatusMutation.getFragment('viewer')},
        ${RemoveTodoMutation.getFragment('viewer')}
      }
    `,
    todo: () => Relay.QL`
      fragment on Todo {
        complete,
        id,
        text,
        ${ChangeTodoStatusMutation.getFragment('todo')},
        ${RemoveTodoMutation.getFragment('todo')},
        ${RenameTodoMutation.getFragment('todo')}
      }
    `
  }
});
