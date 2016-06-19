import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
} from 'react-native';
import Relay from 'react-relay';
import { IndexLink, Link } from 'react-router-native';

import TextButton from './TextButton';
import RemoveCompletedTodosMutation
  from '../mutations/RemoveCompletedTodosMutation';


const styles = StyleSheet.create({
  footer: {
    flex: 0,
    flexDirection: 'column',
    alignItems: 'stretch',
    // justifyContent: 'space-between',
    backgroundColor: '#eee',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  todoCount: {
    padding: 8,
    fontSize: 13,
  },
  clearCompleted: {
    alignSelf: 'flex-start',
    padding: 8,
    backgroundColor: 'red',
    margin: 4,
    borderRadius: 3,
  },
  clearCompletedText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  filters: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  li: {
    backgroundColor: '#ddd',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    marginHorizontal: 4,
  },
  selected: {
    backgroundColor: '#aaf',
  },
  liText: {
    padding: 12,
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '500',
  },
});

class TodoListFooter extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  onClearCompletedClick() {
    const { viewer } = this.props;
    const { todos } = viewer;

    Relay.Store.commitUpdate(
      new RemoveCompletedTodosMutation({ viewer, todos })
    );
  };

  renderRemaining() {
    const { numTodos } = this.props.viewer;

    return (
      <Text style={styles.todoCount}>
        {numTodos} {numTodos === 1 ? 'item' : 'items'} left
      </Text>
    );
  }

  renderClearCompleted() {
    if (!this.props.viewer.numCompletedTodos) {
      return null;
    }

    return (
      <TextButton
        style={styles.clearCompleted}
        textStyle={styles.clearCompletedText}
        onPress={this.onClearCompletedClick.bind(this)}
        text="Clear completed"
      />
    );
  }

  render() {
    if (!this.props.viewer.numTodos) {
      return null;
    }

    return (
      <View style={styles.footer}>
        {this.renderRemaining()}

        <View style={styles.filters}>
          <IndexLink to="/" style={styles.li} activeStyle={styles.selected}>
            <Text style={styles.liText}>All</Text>
          </IndexLink>
          <Link to="/active" style={styles.li} activeStyle={styles.selected}>
            <Text style={styles.liText}>Active</Text>
          </Link>
          <Link to="/completed" style={styles.li} activeStyle={styles.selected}>
            <Text style={styles.liText}>Completed</Text>
          </Link>
        </View>
        {this.renderClearCompleted()}
      </View>
    );
  }
}

export default Relay.createContainer(TodoListFooter, {
  prepareVariables() {
    return {
      limit: -1 >>> 1
    };
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        todos(status: "completed", first: $limit) {
          ${RemoveCompletedTodosMutation.getFragment('todos')}
        },
        numTodos,
        numCompletedTodos,
        ${RemoveCompletedTodosMutation.getFragment('viewer')}
      }
    `
  }
});
