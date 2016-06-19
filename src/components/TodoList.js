import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
} from 'react-native';
import Relay from 'react-relay';

import MarkAllTodosMutation from '../mutations/MarkAllTodosMutation';

import Todo from './Todo';


const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  toggleRow: {
    padding: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9df',
  },
  toggleAll: {
    marginRight: 8,
  },
  toggleAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  todoList: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
});

class TodoList extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  onToggleAllChange(complete) {
    const { viewer } = this.props;
    const { todos } = viewer;

    Relay.Store.commitUpdate(
      new MarkAllTodosMutation({ viewer, todos, complete })
    );
  };

  renderTodos() {
    const { viewer } = this.props;

    return viewer.todos.edges.map(({ node }) =>
      <Todo
        key={node.id}
        viewer={viewer}
        todo={node}
      />
    );
  }

  render() {
    const { numTodos, numCompletedTodos } = this.props.viewer;
    if (!numTodos) {
      return null;
    }

    return (
      <View style={styles.main}>
        <View style={styles.toggleRow}>
          <Switch
            style={styles.toggleAll}
            value={numTodos === numCompletedTodos}
            onValueChange={this.onToggleAllChange.bind(this)}
          />
          <Text style={styles.toggleAllText}>
            Mark all as complete
          </Text>
        </View>

        <View style={styles.todoList}>
          {this.renderTodos()}
        </View>
      </View>
    );
  }
}

export default Relay.createContainer(TodoList, {
  initialVariables: {
    status: null
  },

  prepareVariables({ status }) {
    let nextStatus;
    if (status === 'active' || status === 'completed') {
      nextStatus = status;
    } else {
      // This matches the Backbone examples, which displays all todos on an
      // invalid route.
      nextStatus = 'any';
    }

    return {
      status: nextStatus,
      limit: -1 >>> 1
    };
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        todos(status: $status, first: $limit) {
          edges {
            node {
              id,
              ${Todo.getFragment('todo')}
            }
          }
          ${MarkAllTodosMutation.getFragment('todos')}
        },
        numTodos,
        numCompletedTodos,
        ${Todo.getFragment('viewer')},
        ${MarkAllTodosMutation.getFragment('viewer')}
      }
    `
  }
});
