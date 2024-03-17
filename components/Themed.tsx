import {
  Text as DefaultText,
  View as DefaultView,
  Pressable,
} from 'react-native';
import {
  MaterialIcons,
  Feather,
  Ionicons,
  Fontisto,
  MaterialCommunityIcons,
  AntDesign,
} from '@expo/vector-icons';
import Colors, { ignoreTextColor } from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { OpaqueColorValue } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { Button } from '@rneui/themed';
import { secondaryColor } from '../constants/Colors';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import { ReactNode } from 'react';
import { BlurView } from 'expo-blur';
import clsx from 'clsx';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps & { isTitle?: boolean }) {
  const { style, lightColor, darkColor, isTitle, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <DefaultText
      style={[{ color, height: isTitle ? 38 : null }, style]}
      {...otherProps}
    />
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background',
  );

  return (
    <DefaultView
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}

export function TransparentView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  return (
    <DefaultView
      style={[{ backgroundColor: 'transparent' }, style]}
      {...otherProps}
    />
  );
}

export function MaterialIcon(
  props: ViewProps & {
    size?: number;
    name: React.ComponentProps<typeof MaterialIcons>['name'];
    color?: string | OpaqueColorValue;
    ignore?: boolean;
  },
) {
  const { lightColor, darkColor, size, color, ignore, ...otherProps } = props;
  const tint = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

  return (
    <MaterialIcons
      size={size || 25}
      color={ignore ? ignoreTextColor : color || tint}
      {...otherProps}
    />
  );
}

export function MaterialCommunityIcon(
  props: ViewProps & {
    size?: number;
    name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    color?: string | OpaqueColorValue;
    ignore?: boolean;
  },
) {
  const { lightColor, darkColor, size, color, ignore, ...otherProps } = props;
  const tint = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

  return (
    <MaterialCommunityIcons
      size={size || 25}
      color={ignore ? ignoreTextColor : color || tint}
      {...otherProps}
    />
  );
}

export const FontistoIcon = (
  props: ViewProps & {
    size?: number;
    name: React.ComponentProps<typeof Fontisto>['name'];
    color?: string | OpaqueColorValue;
    ignore?: boolean;
  },
) => {
  const { lightColor, darkColor, size, color, ignore, ...otherProps } = props;
  const tint = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

  return (
    <Fontisto
      size={size || 25}
      color={ignore ? ignoreTextColor : color || tint}
      iconStyle={{
        fontWeight: 10,
      }}
      {...otherProps}
    />
  );
};

export function AntDesignIcon(
  props: ViewProps & {
    size?: number;
    name: React.ComponentProps<typeof AntDesign>['name'];
    color?: string | OpaqueColorValue;
    ignore?: boolean;
  },
) {
  const { lightColor, darkColor, size, color, ignore, ...otherProps } = props;
  const tint = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

  return (
    <AntDesign
      size={size || 25}
      color={ignore ? ignoreTextColor : color || tint}
      {...otherProps}
    />
  );
}

export function IonIcon(
  props: ViewProps & {
    size?: number;
    name: React.ComponentProps<typeof Ionicons>['name'];
    color?: string | OpaqueColorValue;
    ignore?: boolean;
  },
) {
  const { lightColor, darkColor, size, color, ignore, ...otherProps } = props;
  const tint = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

  return (
    <Ionicons
      size={size || 25}
      color={ignore ? ignoreTextColor : color || tint}
      iconStyle={{
        fontWeight: 10,
      }}
      {...otherProps}
    />
  );
}

export function FeatherIcon(
  props: ViewProps & {
    size?: number;
    name: React.ComponentProps<typeof Feather>['name'];
    color?: string | OpaqueColorValue;
    ignore?: boolean;
  },
) {
  const { lightColor, darkColor, size, color, ignore, ...otherProps } = props;
  const tint = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

  return (
    <Feather
      size={size || 25}
      color={ignore ? ignoreTextColor : color || tint}
      {...otherProps}
    />
  );
}

export const PressableIcon = (
  props: ViewProps & {
    size?: number;
    name: React.ComponentProps<typeof MaterialIcons>['name'];
    color?: string | OpaqueColorValue;
    onPress: (event: GestureResponderEvent) => void;
  },
) => {
  return (
    <Pressable onPress={props.onPress}>
      <MaterialIcon {...props} />
    </Pressable>
  );
};

export const BaseBlurButton = (props: {
  children?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  title?: string;
  radius?: string;
  fontSize?: number;
  intensity?: number;
  onPress: () => void;
}) => {
  return (
    <BlurView
      className={clsx('rounded-full overflow-hidden', props.radius)}
      style={props.containerStyle}
      intensity={props.intensity || 80}>
      <Button
        title={props.title}
        titleStyle={{
          color: secondaryColor,
          fontSize: props.fontSize,
        }}
        buttonStyle={{
          backgroundColor: 'transparent',
        }}
        containerStyle={{
          width: '100%',
        }}
        onPress={props.onPress}>
        {props.children}
      </Button>
    </BlurView>
  );
};

export const BaseButton = (props: {
  children?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  radius?: number;
  title?: string;
  type?: 'clear' | 'solid' | 'outline';
  onPress: () => void;
}) => {
  return (
    <Button
      title={props.title}
      titleStyle={{
        color: secondaryColor,
      }}
      buttonStyle={{
        backgroundColor: 'transparent',
      }}
      containerStyle={props.containerStyle}
      onPress={props.onPress}
      radius={props.radius || 20}
      type={props.type || 'solid'}>
      {props.children}
    </Button>
  );
};
