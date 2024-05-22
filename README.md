# Dental Care Server

## Overview

This is the backend server for the Dental Care application. It provides endpoints for managing dental care-related data and interacts with a MongoDB database.

## Usage

To interact with the server, you can use the provided endpoints. For example:

```javascript
fetch("/addData")
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));

### Database
  * Mongodb

#### Use Packages 

- express 
- nodemon
- cors
- body-parser

