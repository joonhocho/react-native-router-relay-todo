import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Relay from 'react-relay';

import AddTodoMutation from '../mutations/AddTodoMutation';

import TodoListFooter from './TodoListFooter';
import TodoTextInput from './TodoTextInput';


const styles = StyleSheet.create({
  app: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  content: {
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    margin: 8,
  },
});

class TodoApp extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    children: React.PropTypes.node.isRequired
  };

  onNewTodoSave(text) {
    const { viewer } = this.props;

    Relay.Store.commitUpdate(
      new AddTodoMutation({ viewer, text })
    );
  };

  render() {
    const { viewer, children } = this.props;

    return (
      <View style={styles.app}>
        <View style={styles.content}>
          <Text style={styles.header}>todos</Text>
          <TodoListFooter viewer={viewer} />
          <TodoTextInput
            placeholder="What needs to be done?"
            autoFocus
            onSave={this.onNewTodoSave.bind(this)}
          />
        </View>
        {children}
      </View>
    );
  }
}

export default Relay.createContainer(TodoApp, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${TodoListFooter.getFragment('viewer')},
        ${AddTodoMutation.getFragment('viewer')}
      }
    `
  }
});
