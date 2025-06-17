import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default class SearchBy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
  }

  handleSearchChange = (text) => {
    this.setState({ searchText: text });
    if (this.props.onSearch) {
      this.props.onSearch(text);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Pesquisar gêneros..."
          placeholderTextColor="#999"
          value={this.state.searchText}
          onChangeText={this.handleSearchChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  input: {
    width: 245,
    borderWidth: 1,
    borderColor: '#3d5564',
    fontSize: 16,
    borderRadius: 6,
    padding: 14,
    color: '#FFF',
    marginBottom: 2,
  },
});