# Application overview

## front end components
### Home  
The home component houses all the other components. The first interaction a user will have with the home component is the display of a child sub component which prompts for user registration or login. 

upon successful login, the user token is received from the REST API and stored in the global state using react context API.

When the token is present, the login component unmounts, and the todolist/ create list components mount.

### List
The List, upon mount (useEffect), makes calls to the api to request the lists and user todos, using the token from the global state. Once the data is received, todo lists are displayed. 

The nature of this application is such that data is dynamic, and therefore it is likely that updated information will need to be fetched, therefore the useEffect call also includes a piece of state called 'update' within the dependency array, so that when child components make a successful request via FetchButton, the update state is modified, triggering the useEffect call to request fresh data. 

### Fetch button component
This project makes heavy usage of buttons to fire http requests to the API, and so I have created a component to prevent repetitive code. 

The component makes requests using axios internally. In the event of error an error is displayed. In the event of success, a setter function is called, the intended purpose being to tell parent components to update, as the data has incurred an update (see List component update state)

This component takes as props: 
- label
- disabled (bool)
- url: url to request
- method: the type of request
- setter: upon successful request (200) response, function to call

## back end 
I have used express.js to build the backend for this project. 
Data is stored using a mysql db. 
There are several endpoints made available: 

### post /signup
password is hashed using bcrypt and stored in database

### post /login
password is compared to encrypted version stored in db using bcrypt, if it matches, a JWT is created and sent as response.

### All other routes
All other routes make use of an authentication middleware to deserialise the token and check it's validity. Otherwise a fail response is sent. Successful requests are then passed onto the next callback in the route, with the username of the user associated with the token appended to the request body. 



