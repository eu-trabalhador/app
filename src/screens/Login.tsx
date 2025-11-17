import { StyleSheet, View, TouchableOpacity, Text , Modal, Alert} from 'react-native';
import {  useSafeAreaInsets } from 'react-native-safe-area-context';
import {  SafeAreaView} from 'react-native';
import { TitleComponent } from '../components/TitleComponent';
import { HeaderM1 } from '../components/HeaderM1';
import { InputText } from '../components/InputText';
import { InputPassword } from '../components/InputPassword';
import {useNavigation} from '@react-navigation/native'
import { ButtonComponent } from '../components/ButtonComponent';
import { useEffect, useState } from 'react';
// import { useFonts,Inter_700Bold, Inter_400Regular } from '@expo-google-fonts/inter';
import { useUser } from '../context/Auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {AuthStack} from '../routes/AuthStack'


export default function Login() {

  const{modifyPassword} = useUser();
  const{signIn,setAction} = useUser();
  const [email, setEmail] = useState('');
  const [emailNewPassword, setEmailNewPassword] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<AuthStack>();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [visiblemodal2, setVisiblemodal2] = useState(false);


  const toggleVisible = (value:boolean) => {
    setVisible(value)
  };

  //trata e-mail e cpf
  const sanitizeInput = (input: string) => {
    const trimmedInput = input.trim();
    if (trimmedInput.includes("@")) {
      return trimmedInput;
    }
    return trimmedInput.replace(/[^\d]/g,"");
  };
  


  const handleLogin = async() => {
    try{
      const sanitizedEmail = sanitizeInput(email);
      await signIn(sanitizedEmail,password)
    }catch (error) {
      Alert.alert("Erro ao fazer login:");
    };
  }

  const handleModifyPassword = async(email:string) => {
    try{
      if(email){
        const sanitizedEmail = sanitizeInput(email);
        await modifyPassword(email);
        toggleVisible(false);
        setVisiblemodal2(true)
        // Alert.alert("Email enviado com sucesso!")
      }else{
        Alert.alert("Email inválido.");
      }

    }catch (error) {
      Alert.alert("Usuário não encontrado.");
    };
  }

  const maskEmail = (email:string | null | undefined) => {
    if(email){
      const [user, domain] = email.split("@");
      const maskedUser = user.length > 2 ? `${user.charAt(0)}****${user.charAt(user.length - 1)}` : `${user.charAt(0)}****`;
      return `${maskedUser}@${domain}`;
    }else{
      return "";
    }
  };





  return (

    <View style = {styles.container}>

      <View style = {styles.header}>
        <HeaderM1/>
      </View>

      <View style = {styles.body}>

        <View style = {styles.containerTextWelcome}>
          <TitleComponent text={"Bem vindo de volta"} />
        </View>

        <View style = {styles.containerInputs}>
          <InputText value = {email} placeHolder={"E-mail"} focus = {false} steFocus={()=>{}} keyboardType="email-address" onChangeText={(it:string)=> setEmail(it)}/>
        </View>

        <View style = {styles.containerInputs}>
          <InputPassword focus={false} steFocus={()=>{}} placeHolder={"Senha"} keyboardType={"default"} onChangeText={(it)=> setPassword(it)}/>
        </View>

        <View style = {styles.containerLinkPassword}>
          <TouchableOpacity onPress={()=>toggleVisible(true)}>
            <Text style={styles.linkPassword} allowFontScaling={false}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>
        

      </View>
      <View style = {styles.bodyButton}>

        <ButtonComponent name={"Entrar" } press = {handleLogin}/>

        <View style = {styles.containerLinkCadastro}>

          <Text style={styles.textCadastro} allowFontScaling={false}>Novo aqui?</Text>

          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.linkCadastro} allowFontScaling={false}>Cadastre-se</Text>
          </TouchableOpacity>

        </View>
      </View>




      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => {
          toggleVisible(false)
          setEmailNewPassword("")
        }}
      > 
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={0}      
          onPressOut={() => {
            toggleVisible(false)
            setEmailNewPassword("")
          }}
        >
          <View style={styles.containerPassword}>
            <Text style={styles.text1} allowFontScaling={false}>Alteração de senha</Text>
            <Text style={styles.text2} numberOfLines={3} allowFontScaling={false}>Digite o seu e-mail de usuário e lhe enviaremos uma mensagem para redefinição de sua senha.</Text>
              <View style = {styles.containerRedefinition}>
                <InputText placeHolder={"E-mail"} value = {emailNewPassword} focus = {false} steFocus={()=>{}} keyboardType="email-address" onChangeText={(it:string)=> setEmailNewPassword(it)}/>
                <ButtonComponent name={"Enviar" } press = {()=>handleModifyPassword(emailNewPassword)}/>
              </View>
          </View>
          </TouchableOpacity>
      </Modal>
      <Modal
        transparent
        visible={visiblemodal2}
        animationType="fade"
        onRequestClose={() => {setVisiblemodal2(false),setEmailNewPassword("")}}
      >
        <TouchableOpacity
          style={styles.modal2}
          activeOpacity={0.4}      
          onPressOut={() => {setVisiblemodal2(false),setEmailNewPassword("")}}
        >
          <View style={styles.containerPassword2}>
            <Text style={styles.text12} allowFontScaling={false}>Alteração de senha</Text>
            <Text style={styles.text22} numberOfLines={3} ellipsizeMode="tail" allowFontScaling={false}>Foi enviado um <Text style={styles.email2} allowFontScaling={false}>e-mail</Text> de alteração de senha para o endereço <Text style={styles.email2} allowFontScaling={false}>{maskEmail(emailNewPassword)}</Text>.</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex :1,
    flexDirection: 'column',
    alignItems: 'center',
    width : '100%',
    height : '100%',
    justifyContent : 'space-between',
    // justifyContent : 'flex-start',
    backgroundColor : '#ffffff'
  },
  header:{
    // backgroundColor : '#100101',
    width : '100%',
    height : 150
  },
  body : {
    // backgroundColor : '#d70e0e',
    // top:246,
    // flex : 1,
    flexDirection : 'column',
    width : '100%',
    justifyContent : 'flex-start',
    // position: 'absolute',

  },
  containerTextWelcome:{
    width : '100%',
    paddingTop : 20,
    paddingHorizontal : 16,
    paddingBottom : 12,
    height : 67,
    alignItems : 'center',
    justifyContent : 'center'
    
  },
  containerInputs :{
    width : '100%',
    paddingTop : 20,
    paddingHorizontal : 16,
    paddingVertical : 12,
    height : 80,
  },
  containerLinkPassword:{
    flexDirection : 'row',
    width : '100%',
    alignItems : 'flex-start',
    justifyContent : 'flex-end',
    height:31,
    paddingTop : 4,
    paddingHorizontal : 16,
    paddingBottom :12,
  },
  linkPassword:{
    color: '#A17D1C',
    fontSize: 14,
    // fontFamily: 'Inter_400Regular',
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'center',
    height: 21,
    alignContent:'center',
  },
  bodyButton : {
    width : '100%',
    marginTop : 0,
    paddingVertical : 12,
    paddingHorizontal : 16,
    flexDirection : 'column',
    justifyContent : 'flex-start',
    alignItems : 'center',
    backgroundColor:'#ffffff'
  },
  containerLinkCadastro:{
    flexDirection : 'row',
    width : '100%',
    alignItems : 'center',
    justifyContent : 'center',
    paddingHorizontal : 20,
    gap : 5,
    height : 48
  },
  textCadastro:{
    color: '#211A0A',
    fontSize: 16,
    // fontFamily: 'Inter_700Bold',
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
    height: 24,
    alignContent:'center'
  },
  linkCadastro:{
    color: '#0038E1',
    fontSize: 16,
    // fontFamily: 'Inter_700Bold',
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
    height: 24,
    alignContent:'center'
  },
  modal: {
    flex: 1,
    backgroundColor: '#ffffffd0',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding : 23,
    flexDirection : 'column',
    justifyContent:'center'
  },
  containerPassword: {
    // flex: 1,
    backgroundColor: '#ffffff',
    // position: 'absolute',
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
    padding : 23,
    flexDirection : 'column',
    justifyContent:'center',
    borderColor : "#00000014",
    borderWidth : 1,
    shadowColor : '#000000',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6, 
    borderRadius: 25
  },
  text1:{
    color: '#000000',
    fontSize: 16,
    // fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 20.83,
    textAlign: 'center',
    height: 21,
    alignContent:'center',
    marginBottom : 30
  },
  text2:{
    color: '#000000',
    fontSize: 14,
    // fontFamily: 'Poppins',
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'center',
    // height: 21,
    alignContent:'center',
    marginBottom : 30
  },
  containerRedefinition:{
    flexDirection : 'column',
    width : '100%',
    gap : 50
  },
  modal2: {
    flex: 1,
    backgroundColor: '#ffffffc7',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding : 23
  },
  containerPassword2:{
    top: 346,
    backgroundColor : '#ffffff',
    borderRadius : 25,
    height : 121,
    width: '100%',
    borderColor : "#00000014",
    borderWidth : 1,
    shadowColor : '#000000',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6, 
    paddingHorizontal: 15,
    paddingVertical : 10,
    gap : 18
  },
  text12:{
    color: '#000000',
    fontSize: 16,
    // fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 20.83,
    textAlign: 'center',
    height: 21,
    alignContent:'center'
  },
  text22:{
    color: '#000000af',
    fontSize: 14,
    // fontFamily: 'DM Sans',
    fontWeight: '400',
    lineHeight: 18.23,
    textAlign: 'center',
    alignContent:'center'
  },
  email2:{
    color: '#1717f9', // Cor azul para o e-mail
  },
});
