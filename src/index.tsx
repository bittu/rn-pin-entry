import React, { Component, type RefObject } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  I18nManager,
  type ViewStyle,
  type TextStyle,
  type KeyboardTypeOptions,
  type TextInputProps,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  cellContainer: {
    position: 'absolute',
    margin: 0,
    height: '100%',
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
  },
  cell: {
    borderColor: 'gray',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellFocused: {
    borderColor: 'black',
    borderWidth: 2,
  },
  text: {
    color: 'gray',
    fontSize: 24,
  },
  textFocused: {
    color: 'black',
  },
  hiddenInput: {
    flex: 1,
    opacity: 0.1,
    textAlign: 'center',
  },
});

interface RNPinEntryProps {
  value?: string;
  codeLength?: number;
  cellSize?: number;
  cellSpacing?: number;
  placeholder?: string | JSX.Element;
  mask?: string | JSX.Element;
  maskDelay?: number;
  password?: boolean;
  autoFocus?: boolean;
  restrictToNumbers?: boolean;
  containerStyle?: ViewStyle;
  cellStyle?: ViewStyle;
  cellStyleFocused?: ViewStyle;
  cellStyleFilled?: ViewStyle;
  textStyle?: TextStyle;
  textStyleFocused?: TextStyle;
  keyboardType?: KeyboardTypeOptions;
  animated?: boolean;
  onTextChange?: Function;
  animationFocused?: string;
  testID?: string;
  onFulfill?: Function;
  editable?: boolean;
  onBackspace?: Function;
  onFocus?: Function;
  onBlur?: Function;
  inputProps?: TextInputProps;
  disableFullscreenUI?: boolean;
}

interface RNPinEntryState {
  maskDelay: boolean;
  focused: boolean;
}

class RNPinEntry extends Component<RNPinEntryProps, RNPinEntryState> {
  state = {
    maskDelay: false,
    focused: false,
  };

  ref: RefObject<Animatable.View> = React.createRef();
  inputRef: RefObject<TextInput> = React.createRef();

  maskTimeout: NodeJS.Timeout | undefined;

  animate = ({
    animation = 'shake',
    duration = 650,
  }): Promise<{ finished: boolean }> | undefined => {
    if (!this.props.animated) {
      return new Promise((_, reject) =>
        reject(new Error('Animations are disabled'))
      );
    }
    //@ts-ignore
    if (this.ref && this.ref.current && this.ref.current[animation]) {
      //@ts-ignore
      return this.ref.current[animation](duration);
    }
    return;
  };

  shake = (duration = 650): Promise<{ finished: boolean }> | undefined =>
    this.animate({ duration });

  focus = (): void => {
    return this.inputRef.current!.focus();
  };

  blur = (): void => {
    return this.inputRef.current!.blur();
  };

  clear = (): void => {
    return this.inputRef.current!.clear();
  };

  _inputCode = (code: string): void => {
    const { password, codeLength = 4, onTextChange, onFulfill } = this.props;

    if (this.props.restrictToNumbers) {
      code = (code.match(/[0-9]/g) || []).join('');
    }

    if (onTextChange) {
      onTextChange(code);
    }

    if (code.length === codeLength && onFulfill) {
      onFulfill(code);
    }

    const maskDelay = !!(password && code.length > this.props.value!.length);

    this.setState({ maskDelay });

    if (maskDelay) {
      clearTimeout(this.maskTimeout);
      this.maskTimeout = setTimeout(() => {
        this.setState({ maskDelay: false });
      }, this.props.maskDelay!);
    }
  };

  _keyPress = (event: any): void => {
    if (event.nativeEvent.key === 'Backspace') {
      const { value, onBackspace } = this.props;
      if (value === '' && onBackspace) {
        onBackspace();
      }
    }
  };

  _onFocused = (): void => {
    this.setState({ focused: true });
    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus();
    }
  };

  _onBlurred = (): void => {
    this.setState({ focused: false });
    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur();
    }
  };

  _forceFocus = (): void => {
    this.inputRef.current!.focus();
  };

  componentWillUnmount(): void {
    clearTimeout(this.maskTimeout);
  }

  render() {
    const {
      value,
      codeLength,
      cellSize,
      cellSpacing,
      placeholder,
      password,
      mask,
      autoFocus,
      containerStyle,
      cellStyle,
      cellStyleFocused,
      cellStyleFilled,
      textStyle,
      textStyleFocused,
      keyboardType,
      animationFocused,
      animated,
      testID,
      editable,
      inputProps,
      disableFullscreenUI,
    } = this.props;

    const { maskDelay, focused } = this.state;

    const valLen = value?.length || 0;

    return (
      <TouchableOpacity onPress={this._forceFocus}>
        <Animatable.View
          ref={this.ref}
          style={[
            containerStyle,
            {
              width: cellSize! * codeLength! + cellSpacing! * (codeLength! - 1),
              height: cellSize!,
            },
          ]}
        >
          <View style={styles.cellContainer}>
            {Array.apply(null, Array(codeLength)).map((_, idx) => {
              const cellFocused = focused && idx === valLen;
              const filled = idx < valLen;
              const last = idx === valLen - 1;
              const showMask = filled && password && (!maskDelay || !last);
              const isPlaceholderText = typeof placeholder === 'string';
              const isMaskText = typeof mask === 'string';
              const pinCodeChar = value?.charAt(idx);

              let cellText = null;

              if (filled || placeholder !== null) {
                if (showMask && isMaskText) {
                  cellText = mask;
                } else if (!filled && isPlaceholderText) {
                  cellText = placeholder;
                } else if (pinCodeChar) {
                  cellText = pinCodeChar;
                }
              }

              const placeholderComponent = !isPlaceholderText
                ? placeholder
                : null;

              const maskComponent = showMask && !isMaskText ? mask : null;

              const isCellText = typeof cellText === 'string';

              return (
                <Animatable.View
                  key={idx}
                  style={[
                    {
                      width: cellSize!,
                      height: cellSize!,
                      marginLeft: cellSpacing! / 2,
                      marginRight: cellSpacing! / 2,
                    },
                    styles.cell,
                    cellStyle,
                    cellStyleFocused ? cellStyleFocused : styles.cellFocused,
                    filled ? cellStyleFilled : {},
                  ]}
                  animation={
                    idx === valLen && focused && animated
                      ? animationFocused
                      : ''
                  }
                  iterationCount="infinite"
                  duration={500}
                >
                  {isCellText && !maskComponent && (
                    <Text
                      style={[
                        styles.text,
                        textStyle,
                        cellFocused
                          ? textStyleFocused || styles.textFocused
                          : {},
                      ]}
                    >
                      {cellText}
                    </Text>
                  )}

                  {!isCellText && !maskComponent && placeholderComponent}

                  {isCellText && maskComponent}
                </Animatable.View>
              );
            })}
          </View>

          <TextInput
            disableFullscreenUI={disableFullscreenUI}
            value={value}
            ref={this.inputRef}
            onChangeText={this._inputCode}
            onKeyPress={this._keyPress}
            onFocus={() => this._onFocused()}
            onBlur={() => this._onBlurred()}
            spellCheck={false}
            autoFocus={autoFocus}
            keyboardType={keyboardType}
            numberOfLines={1}
            caretHidden
            maxLength={codeLength!}
            selection={{
              start: valLen,
              end: valLen,
            }}
            style={styles.hiddenInput}
            testID={testID || undefined}
            editable={editable}
            {...inputProps}
          />
        </Animatable.View>
      </TouchableOpacity>
    );
  }

  static defaultProps = {
    value: '',
    codeLength: 4,
    cellSize: 48,
    cellSpacing: 4,
    placeholder: '',
    password: false,
    mask: '*',
    maskDelay: 200,
    keyboardType: 'numeric',
    autoFocus: false,
    restrictToNumbers: false,
    animationFocused: 'pulse',
    animated: true,
    editable: true,
    inputProps: {},
    disableFullscreenUI: true,
  };
}

export default RNPinEntry;
