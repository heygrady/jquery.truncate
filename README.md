jQuery UI widget designed for truncating text in a browser to a specific height. This is much better than truncating text to a specific string length because that method is extremely imprecise.

For instance, it can be quite difficult to truncate text down to four lines. Using text lenght alone might result in a string that is 3 lines or 5 lines depending on the characters involved. Imagine truncating a commend that is made entirely of "w" or only "i". You can fit a lot more i's on 4 lines than you can fit w's.

```javascript
$('div').truncate( { height: 100} );
```

NOTE: currently the height property should not contain units.

