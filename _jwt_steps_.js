/****
 * install jsonwebtoken
 * jwt.sign (payload, secret, {expiresIn:})
 * token client
 * 
 * 
*/

/****
 * How to store in the client side
 * 1. Memory --> ok types
 * 2. Local Storage --> ok types (XSS)
 * 3. cookies: http only
*/

/**
 * 1. set cookies with http only. for development secure: false,
 * 2. cors :::
 * app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
    }));

 * 3. client side axios setting
    In axios set withCredentials: true
*/

/**
 * 1. to send cookies from the client make sure you added withCredentials true for the api call using axios
 * 2. use cookie parser as middleware
*/