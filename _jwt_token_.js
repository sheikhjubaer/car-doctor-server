/**
 * ---------------------------------------------------------
 *                  MAKE API SECURE
 * ---------------------------------------------------------
 * The person who should have access
 * 
 * Concept:
 * 1. Assign two tokens for each person (access token, refresh token)
 * 2. access Token contains : user Identification (email, role, etc.). valid for a shorter duration
 * 3. refresh token is used : to recreate an acccess token that was expired!
 * 4. if refresh token is invalid then logout the user. 
 * 
*/


/**
 * 1. jwt --> json web token
 * 2. generate a token by using jwt.sign
 * 3. create an API set to cookie. httponly, secure, samesite
 * 4. from client site: axios withCredentials true
 * 5. cors setup origin and credentials: true
*/

/**
 * 1. for secure api calls
 * 2. install cookie parser and use it as a middleware
 * 3. req.cookies
 * 4. on the client site: make api call using axios withCredentials: true or credentials include while using fetch
 * 5. 
*/