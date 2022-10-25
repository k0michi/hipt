# Hierarchically Indented Plain Text

This is a library to parse plain text with indentation like this:

```
abc
  def
    ghi
123
  456
    789
```

## Installation

```bash
$ npm i hipt
$ yarn add hipt
```

## Usage

```js
import * as hipt from 'hipt';

const root = hipt.parse(
`abc
  def
    ghi
123
  456
    789`
);
/*
{
  "children": [
    {
      "value": "abc",
      "children": [
        {
          "value": "def",
          "children": [
            {
              "value": "ghi",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "value": "123",
      "children": [
        {
          "value": "456",
          "children": [
            {
              "value": "789",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
*/
```

## License
MIT License