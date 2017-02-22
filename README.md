## Synopsis

Eloqua-js offers two methods for consuming Eloqua's REST API

## Code Example

```
import Eloqua from 'eloqua-js';

const elq = new Eloqua(process.env.AUTHORIZATION);

// Print all contacts to the console.
elq.getAllPagesAndHandle('/API/REST/2.0/data/contacts', console.log);

// Print all contacts to the console again.
const contacts = await elq.getPagesAsArray('/API/REST/2.0/data/contacts');
console.log(contacts);
```
