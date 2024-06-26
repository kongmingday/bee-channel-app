import { Text, BaseBlurButton, TransparentView } from '@/components/Themed';
import { TextInput, Pressable } from 'react-native';
import { secondTextColor, secondBgColor } from '@/constants/Colors';
import { router } from 'expo-router';
import { useState } from 'react';
import { MotiView, AnimatePresence } from 'moti';
import { sendCodeToEmail, verify } from '@/api/checkcode';
import { isEmail } from '@/utils/common/calculateUtil';
import { login, signUp } from '@/api/auth';
import { VERIFY_KEY } from '@/constants/constant';
import { handleShowToast } from '@/store/assembly/appAssembly';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '@/utils/common/tokenUtils';
import { NotTabView } from '@/components/CommonView';
import { SignInType } from '@/constants/enum';

const MainArea = (props: {
	loginState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) => {
	const dispatch = useDispatch();
	const [isLogin, setLoginState] = props.loginState;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [code, setCode] = useState('');
	const [loginType, setLoginType] = useState<SignInType>(SignInType.PASSWORD);

	const fetchEmailCode = () => {
		if (!isEmail(email)) {
			handleShowToast(dispatch, 'Please check your email.');
			return;
		}
		sendCodeToEmail(email);
	};

	const handleLogin = async () => {
		if (loginType === SignInType.EMAIL) {
			const verifyResult = await verify(VERIFY_KEY + email, code);
			if (!verifyResult) {
				handleShowToast(dispatch, 'The verify code has error.');
				return;
			}
		}

		const loginResult = await login({
			email,
			password,
			authType: loginType,
		});
		if (!loginResult) {
			handleShowToast(dispatch, 'Please check your account or password.');
		} else {
			setAuthToken(loginResult.access_token);
			router.push('/(tabs)/');
		}
	};

	const handleSignUp = async () => {
		const verifyResult = await verify(VERIFY_KEY + email, code);
		if (password !== confirm) {
			handleShowToast(dispatch, 'The password is different from the confirm.');
			return;
		}
		if (!verifyResult) {
			handleShowToast(dispatch, 'The verify code has error.');
			return;
		}
		signUp({
			email: email,
			password: password,
			isMobile: true,
		}).then(response => {
			if (response.code === 200) {
				handleShowToast(dispatch, 'Sign up successfully.');
				setLoginState(true);
			} else {
				handleShowToast(dispatch, 'Sign up failed.');
			}
		});
	};

	return (
		<MotiView
			className='flex-1 w-full gap-y-5'
			from={{
				opacity: 0,
			}}
			animate={{
				opacity: 1,
			}}
			exit={{
				opacity: 0,
			}}>
			<TransparentView
				className='w-full px-3'
				style={{ gap: 5 }}>
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
				style={{ gap: 15 }}>
				<TextInput
					className='w-[90%] px-4 py-2 rounded-full'
					placeholder='Email'
					value={email}
					inputMode='email'
					onChangeText={setEmail}
					style={{
						backgroundColor: secondBgColor,
					}}
				/>
				{loginType !== SignInType.EMAIL && (
					<TextInput
						secureTextEntry
						className='w-[90%] px-4 py-2 rounded-full'
						placeholder='Password'
						value={password}
						onChangeText={setPassword}
						passwordRules={'*'}
						style={{
							backgroundColor: secondBgColor,
						}}
					/>
				)}
				{!isLogin && (
					<TextInput
						secureTextEntry
						className='w-[90%] px-4 py-2 rounded-full'
						placeholder='Confirm'
						passwordRules={'*'}
						value={confirm}
						onChangeText={setConfirm}
						style={{
							backgroundColor: secondBgColor,
						}}
					/>
				)}
				{(loginType === SignInType.EMAIL || !isLogin) && (
					<TransparentView
						className='w-[90%] flex-row items-center'
						style={{
							gap: 12,
						}}>
						<TextInput
							value={code}
							onChangeText={setCode}
							className='flex-1 px-4 py-2 rounded-full'
							placeholder='Verify Code'
							style={{
								backgroundColor: secondBgColor,
							}}
						/>
						<BaseBlurButton
							containerStyle={{
								flex: 1,
							}}
							onPress={fetchEmailCode}>
							Send
						</BaseBlurButton>
					</TransparentView>
				)}
				{isLogin && (
					<TransparentView className='flex-row gap-1'>
						{loginType === SignInType.PASSWORD ? (
							<Pressable
								onPress={() => {
									setLoginType(SignInType.EMAIL);
								}}>
								<Text>Use email type</Text>
							</Pressable>
						) : (
							<Pressable
								onPress={() => {
									setLoginType(SignInType.PASSWORD);
								}}>
								<Text>Use password type</Text>
							</Pressable>
						)}
					</TransparentView>
				)}
			</TransparentView>
			<MotiView className='w-full absolute bottom-10 gap-y-5 items-center'>
				<BaseBlurButton
					containerStyle={{
						width: '90%',
					}}
					onPress={isLogin ? handleLogin : handleSignUp}>
					{isLogin ? 'Log in' : 'Sign up'}
				</BaseBlurButton>
				<TransparentView className='flex-row gap-1'>
					<Text style={{ color: secondTextColor }}>
						{isLogin ? 'No account yet?' : 'Already have an account?'}
					</Text>
					<Pressable
						onPress={() => {
							setLoginType(SignInType.PASSWORD);
							setLoginState(pre => !pre);
						}}>
						<Text>Click here!</Text>
					</Pressable>
				</TransparentView>
			</MotiView>
		</MotiView>
	);
};

export default function LoginModal() {
	const [isLogin, setLoginState] = useState(true);

	return (
		<NotTabView>
			<MotiView
				className='flex-1 items-center'
				style={{
					gap: 45,
				}}>
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
		</NotTabView>
	);
}
