import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

import TodoList from './components/TodoList'


const index = () => {
  return (
    <View style={styles.container}>
      <TodoList/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: '#fff',  
  }
});


export default index