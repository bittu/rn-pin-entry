# rn-pin-entry

A simple, lightweight, customizable PIN code input component for React Native.

## Installation

```sh
npm install rn-pin-entry
```

## Usage


```jsx
import RNPinEntry from 'rn-pin-entry';

export default function App() {
  const ref = React.useRef();
  const [code, setCode] = React.useState('');

  const checkCode = (c) => {
    if (c !== '1234') {
      ref.current?.shake().then(() => setCode(''));
    }
  }
  return (
    <RNPinEntry
      ref={ref}
      value={code}
      onTextChange={c => setCode(c)}
      onFulfill={this._checkCode}
    />
  )
}
```


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
