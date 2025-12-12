Component({
  properties: {
    type: {
      type: String,
      value: 'spinner' // spinner | dots | circle
    },
    size: {
      type: String,
      value: 'medium' // small | medium | large
    },
    text: {
      type: String,
      value: ''
    }
  }
})