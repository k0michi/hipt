# Hierarchically Indented Plain Text

A library to parse plain text with indentation.

## Example

```
abc
  def
    ghi
123
  456
    789
```

This text is parsed as:

```json
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
```