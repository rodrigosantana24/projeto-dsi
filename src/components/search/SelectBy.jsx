import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default class SelectBy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: props.initialValue || 'all',
    };
  }

  handleValueChange = (value) => {
    this.setState({ selectedValue: value });
    if (this.props.onSelect) {
      this.props.onSelect(value);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Picker
          selectedValue={this.state.selectedValue}
          style={styles.picker}
          onValueChange={this.handleValueChange}
          mode="dropdown"
        >
          <Picker.Item label="Todos" value="all" />
          <Picker.Item label="Nativos" value="true" />
          <Picker.Item label="Não nativos" value="false" />
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