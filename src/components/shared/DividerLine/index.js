import React from 'react'
import { View } from 'react-native'
import { Divider } from 'react-native-elements'

const DividerLine = ({color}) => {
  return (
      <View style={{width: 150}}>
          <Divider orientation='horizontal' width={5} style={{color: 'red', backgroundColor: 'red'}} color={color} />
      </View>
        
  )
}

export default DividerLine