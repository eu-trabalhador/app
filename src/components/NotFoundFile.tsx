import { StyleSheet,Image, Text, View , Dimensions} from "react-native";
import vazio from "../assets/images/vazio.jpg"
const { width } = Dimensions.get("window");
interface NotFoundFileProps {
  value: string;
}
export function NotFoundFile({ value }: NotFoundFileProps) {
 return(
  <View style={styles.container}>
    <Image
      source={vazio}
      style={styles.image}
    />
    <Text allowFontScaling={false} style={{fontSize:20, fontWeight:'500',color:"#ff0000", marginTop:-60, zIndex:99, textAlign:'center'}}>{value}</Text>
  </View>
 )
}

const styles = StyleSheet.create({
 container: {
  width : '100%',
  height : '100%',
  flexDirection:'column',
  justifyContent:'center',
  alignItems:'center'
 },
  image:{
    width : width - 20,
    height : width - 20
  },
})