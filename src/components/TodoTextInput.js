import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import keycode from 'keycode';
import TextButton from './TextButton';

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    paddingLeft: 6,
    height: 40,
    color: 'black',
  },
  cancel: {
    backgroundColor: 'red',
    padding: 8,
    paddingVertical: 4,
    borderRadius: 3,
    margin: 2,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  save: {
    backgroundColor: 'blue',
    padding: 8,
    paddingVertical: 4,
    borderRadius: 3,
    margin: 2,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
});

export default class TodoTextInput extends React.Component {
  static propTypes = {
    commitOnBlur: React.PropTypes.bool.isRequired,
    initialValue: React.PropTypes.string,
    onCancel: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    onSave: React.PropTypes.func.isRequired
  };

  static defaultProps = {
    commitOnBlur: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isEditing: false,
      text: this.props.initialValue || ''
    };
  }

  onKeyDown(e) {
    if (this.props.onCancel && e.keyCode === keycode.codes.esc) {
      this.props.onCancel();
    } else if (e.keyCode === keycode.codes.enter) {
      this.commitChanges();
    }
  };

  onChange(text) {
    this.setState({ text });
  };

  onBlur() {
    if (this.props.commitOnBlur) {
      this.commitChanges();
    }
  };

  commitChanges() {
    const newText = this.state.text.trim();
    if (this.props.onDelete && !newText) {
      this.props.onDelete();
    } else if (this.props.onCancel && newText === this.props.initialValue) {
      this.props.onCancel();
    } else if (newText) {
      this.props.onSave(newText);
      this.setState({ text: '' });
    }
  }

  render() {
    return (
      <View style={styles.box}>
        <TextInput
          style={styles.input}
          {...this.props}
          onKeyDown={this.onKeyDown.bind(this)}
          onChangeText={this.onChange.bind(this)}
          onBlur={this.onBlur.bind(this)}
          value={this.state.text}
        />
        <TextButton
          style={styles.cancel}
          textStyle={styles.cancelText}
          onPress={this.props.onCancel}
          text="Cancel"
        />
        <TextButton
          style={styles.save}
          textStyle={styles.saveText}
          onPress={() => this.commitChanges()}
          text="Save"
        />
      </View>
    );
  }
}
