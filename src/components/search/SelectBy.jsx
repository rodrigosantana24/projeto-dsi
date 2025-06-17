import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default class SelectBy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: props.initialValue || (props.options?.[0]?.value ?? ''),
    };
  }

  handleValueChange = (value) => {
    this.setState({ selectedValue: value });
    if (this.props.onSelect) {
      this.props.onSelect(value);
    }
  };

  render() {
    const { options = [], placeholder } = this.props;
    return (
      <View style={styles.container}>
        <Picker
          selectedValue={this.state.selectedValue}
          style={styles.picker}
          onValueChange={this.handleValueChange}
          mode="dropdown"
        >
          {placeholder && (
            <Picker.Item label={placeholder} value="" />
          )}
          {options.map(opt => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#3d5564',
    borderRadius: 6,
    justifyContent: 'center',
  },
  picker: {
    color: '#FFF',
    height: 50,
    width: '110%',
  },
});