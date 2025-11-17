import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image ,View } from 'react-native';


type Props = {
  imagePath: any;
  text: string;
  funcionpress?: () => void;
};

export const ButtonComponentCircleM3 = ({imagePath, text, funcionpress}:Props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={funcionpress} >
      <View style={styles.containerimage}>
        <Image
          source={imagePath}
          style={styles.image}
        />
      </View>
      <Text allowFontScaling={false} style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // backgroundColor: '#ffffff0',
    // borderRadius: 75,
    flexDirection : 'column',
    alignItems: 'center',
    verticalAlign: 'middle',
    justifyContent: 'center',
    width: "50%",
    height: 92,
    padding : 10,
    gap: 4,
    // backgroundColor : '#bf1313',
  },
  containerimage:{
    height : 70,
    width : 70,
    backgroundColor : '#FFFFFF',
    alignContent : 'center',
    justifyContent : 'center',
    alignItems : 'center',
    borderRadius : 35,
    shadowColor: '#2b6197',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.75,
    shadowRadius: 10,
    elevation: 10, 
  },
  image:{
    height : 40,
    width : 40,
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
    // fontFamily: 'DM_Sans',
    fontWeight: '700',
    lineHeight: 32,
    alignContent:'center',
    textAlign: 'center',
    height: 32,
  },
});

