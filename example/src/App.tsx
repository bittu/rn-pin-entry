import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNPinEntry from 'rn-pin-entry';

interface AppState {
  code: string;
  password: string;
}

export default class App extends React.Component<{}, AppState> {
  state: AppState = {
    code: '',
    password: '',
  };

  pinInput = React.createRef<RNPinEntry>();

  _checkCode = (code: string): void => {
    if (code !== '1234') {
      // @ts-ignore
      this.pinInput.current?.shake().then(() => this.setState({ code: '' }));
    }
  };

  render() {
    const { code, password } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.title}>Default</Text>
          <RNPinEntry
            ref={this.pinInput}
            value={code}
            onTextChange={(c: string) => this.setState({ code: c })}
            onFulfill={this._checkCode}
            onBackspace={() => console.log('No more back.')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Password</Text>
          <RNPinEntry
            password
            mask="﹡"
            keyboardType="default"
            cellSize={36}
            codeLength={8}
            value={password}
            onTextChange={(p: string) => this.setState({ password: p })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Underline</Text>
          <RNPinEntry
            cellStyle={styles.underlineCellStyle}
            cellStyleFocused={styles.underlineCelStyleFocused}
            value={code}
            onTextChange={(c: string) => this.setState({ code: c })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Customized</Text>
          <RNPinEntry
            placeholder="⭑"
            cellStyle={styles.customizedCelLStyle}
            cellStyleFocused={styles.customizedCellStyleFocused}
            textStyle={styles.customizedTextStyle}
            textStyleFocused={styles.customizedTextStyleFocused}
            value={code}
            onTextChange={(c: string) => this.setState({ code: c })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Custom Placeholder</Text>
          <RNPinEntry
            placeholder={<View style={styles.customPlaceHolder} />}
            mask={<View style={styles.customPlaceHolderMask} />}
            maskDelay={1000}
            password={true}
            value={code}
            animated={false}
            onTextChange={(c: string) => this.setState({ code: c })}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    alignItems: 'center',
    margin: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  underlineCellStyle: {
    borderBottomWidth: 2,
    borderColor: 'gray',
  },
  underlineCelStyleFocused: {
    borderColor: 'red',
  },
  customizedCelLStyle: {
    borderWidth: 2,
    borderRadius: 24,
    borderColor: 'orange',
    backgroundColor: 'gold',
  },
  customizedCellStyleFocused: {
    borderColor: 'darkorange',
    backgroundColor: 'orange',
  },
  customizedTextStyle: {
    fontSize: 24,
    color: 'red',
  },
  customizedTextStyleFocused: {
    color: 'orange',
  },
  customPlaceHolder: {
    width: 10,
    height: 10,
    borderRadius: 25,
    opacity: 0.3,
    backgroundColor: 'blue',
  },
  customPlaceHolderMask: {
    width: 10,
    height: 10,
    borderRadius: 25,
    backgroundColor: 'blue',
  },
});
