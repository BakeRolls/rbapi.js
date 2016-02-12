# rbapi.js

```
let RocketBeans = require('./rbapi')

let rbtv = new RocketBeans(key, secret)

rbtv.get('schedule').then((json) => {
	console.log(json)
}).catch((error) => {
	console.log(error)
})
```

Endpoints: `schedule`, `podcast`
