import {
  MaterialIcon,
  Text,
  BaseBlurButton,
  TransparentView
} from '@/components/Themed'
import { TextInput, Pressable } from 'react-native'
import {
  secondTextColor,
  secondBgColor,
  secondaryColor
} from '@/constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useState, useEffect } from 'react'
import { MotiView, AnimatePresence } from 'moti'
import { sendCodeToEmail, verify } from '@/api/checkcode'
import { isEmail } from '@/utils/common/calculateUtil'
import { login } from '@/api/auth'
import { VERIFY_KEY } from '@/.expo/types/constant'
import { handleShowToast } from '@/store/assembly/appAssembly'
import { useDispatch } from 'react-redux'
import { setAuthToken } from '@/utils/common/tokenUtils'

const MainArea = (props: {
  loginState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}) => {
  const dispatch = useDispatch()
  const [isLogin, setLoginState] = props.loginState
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')

  const fetchEmailCode = () => {
    if (!isEmail(email)) {
      handleShowToast(dispatch, 'Please check your email.')
      return
    }
    sendCodeToEmail(email)
  }

  const handleLogin = async () => {
    const verifyResult = await verify(VERIFY_KEY + email, code)
    if (!verifyResult) {
      handleShowToast(dispatch, 'The verify code has error.')
      return
    }

    const loginResult = await login({
      email,
      password,
      authType: 'Password'
    })
    if (!loginResult) {
      handleShowToast(dispatch, 'Please check your account or password.')
      return
    }
    setAuthToken(loginResult.access_token)
    router.push('/(tabs)/user')
  }

  return (
    <MotiView
      className='flex-1 w-full gap-y-5'
      from={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0
      }}
    >
      <TransparentView
        className='w-full px-3'
        style={{ gap: 5 }}
      >
        <Text className='text-2xl'>Hi!</Text>
        <Text className='px-4 text-2xl'>
          {isLogin ? 'Sign in now !' : 'Sign up now !'}
        </Text>
        <Text style={{ color: secondTextColor }}>
          We've been waiting for you for a long time !
        </Text>
      </TransparentView>
      <TransparentView
        className='w-full items-center'
        style={{ gap: 15 }}
      >
        <TextInput
          className='w-[90%] px-4 py-2 rounded-full'
          placeholder='Email'
          value={email}
          inputMode='email'
          onChangeText={setEmail}
          style={{
            backgroundColor: secondBgColor
          }}
        />
        <TextInput
          secureTextEntry
          className='w-[90%] px-4 py-2 rounded-full'
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          passwordRules={'*'}
          style={{
            backgroundColor: secondBgColor
          }}
        />
        {!isLogin && (
          <TextInput
            secureTextEntry
            className='w-[90%] px-4 py-2 rounded-full'
            placeholder='Confirm'
            passwordRules={'*'}
            style={{
              backgroundColor: secondBgColor
            }}
          />
        )}
        <TransparentView
          className='w-[90%] flex-row items-center'
          style={{
            gap: 12
          }}
        >
          <TextInput
            value={code}
            onChangeText={setCode}
            className='flex-1 px-4 py-2 rounded-full'
            placeholder='Verify Code'
            style={{
              backgroundColor: secondBgColor
            }}
          />
          <BaseBlurButton
            containerStyle={{
              flex: 1
            }}
            onPress={fetchEmailCode}
          >
            Send
          </BaseBlurButton>
        </TransparentView>
      </TransparentView>
      <MotiView className='w-full absolute bottom-10 gap-y-5 items-center'>
        <BaseBlurButton
          containerStyle={{
            width: '90%'
          }}
          onPress={() => {
            handleLogin()
          }}
        >
          Log in
        </BaseBlurButton>
        <TransparentView className='flex-row gap-1'>
          <Text style={{ color: secondTextColor }}>
            {isLogin ? 'No account yet?' : 'Already have an account?'}
          </Text>
          <Pressable
            onPress={() => {
              setLoginState((pre) => !pre)
            }}
          >
            <Text>Click here!</Text>
          </Pressable>
        </TransparentView>
      </MotiView>
    </MotiView>
  )
}

export default function LoginModal() {
  const [isLogin, setLoginState] = useState(true)

  return (
    <LinearGradient
      colors={['#e9defa', '#ace0f9']}
      className='flex-1 px-8 pt-6'
    >
      <Pressable
        className='self-start mb-6'
        onPress={() => {
          router.back()
        }}
      >
        <MaterialIcon
          lightColor={secondaryColor}
          name='chevron-left'
          size={30}
        />
      </Pressable>
      <MotiView
        className='flex-1 items-center'
        style={{
          gap: 45
        }}
      >
        <AnimatePresence exitBeforeEnter>
          {isLogin && (
            <MainArea
              key={1}
              loginState={[isLogin, setLoginState]}
            />
          )}
          {!isLogin && (
            <MainArea
              key={2}
              loginState={[isLogin, setLoginState]}
            />
          )}
        </AnimatePresence>
      </MotiView>
    </LinearGradient>
  )
}
