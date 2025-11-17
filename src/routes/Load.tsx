import React from 'react';

import { ActivityIndicator, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type Props = {
 visible: boolean
};

export const Load=({visible}:Props)=>{
 return(
  <>
   {visible && 
    <View style = {{
     position:"absolute", 
     top: 0,
     left: 0,
     right: 0,
     bottom: 0,
     width:"100%",
     height:"100%",
     justifyContent : 'center',
     alignItems:'center',
     backgroundColor:'#ffffff9c',
     zIndex: 1000,
     }}>
     <ActivityIndicator size = {'large'} color={Colors.primary}/>
    </View>
   }
  </>
 )
}