# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


complete update user profile page functionality 
1. focus on connecting api with frontend , we have 4 info to track 
2. we have formdata state and then submit it
3. go to client, dashProfile, 
4. initial value of formdata to be empty string and then change data as it changes
5. we want to handle the formdata change of profile pic sepeately as  cloudniary will be managing it for usm and then other can be handled using on change event listener
6. now we want to submit this data and the api router we created to update the user inside the db
7. 5:5


8.Updating user profile functionality 

9. Delete User API {
    1. Add a DELETE route in the user routes file with :userId as a route parameter.
    2. Protect the route using verifyToken middleware to ensure only authenticated users can access it.
    3. Create a controller function named deleteUser in the controller file.
    4. In the controller:
    Check if req.user.id matches req.params.userId.
    If not, return a 403 (Forbidden) error.
    If matched, delete the user from the database.
    Send a success response.
    5. Handle errors using a try-catch block and forward them to the error handler.
    6. Connect the DELETE route to the deleteUser controller.
    7. Test using Postman:
    Use DELETE method.
    Set the correct URL with userId.
    Include the JWT in the Authorization header.
    8. Confirm it works:
    Only the correct user can delete their account.
    Invalid tokens or mismatched IDs should return appropriate errors.
}

10. Delete User UI{
    1. Add a "Delete Account" button
    2. Create a confirmation modal component
    3. Use useState to toggle modal visibility
    4. Show modal on delete button click                
    5. Add Cancel and Confirm buttons in the modal
    6. Close modal on Cancel click
    7. Trigger deletion function on Confirm click
    8. Make DELETE request to backend with user ID
    9. Dispatch appropriate Redux actions
    10. Handle API response success or failure
    11. Update UI state based on Redux store
    12. Implement backend controller to delete user
    13. Secure route by verifying user identity
    14. Send appropriate success or error response from backend
}

11. SignOut functionality{
    1. created signout controller in backend to clear access_token cookie and send response
    2. added POST /signout route in Express, no token verification required as 
        - Main goal of signout = remove the token from the client (cookie/localStorage).
        - If the token is already expired/invalid, verification fails → user gets stuck and can't sign out.
        - If the token is valid, no real harm in just clearing it without checking.
        - We're not performing any sensitive action here — just removing a cookie.
        - This route is safe and idempotent — hitting it multiple times won't cause issues.
    3. created signoutSuccess reducer in userSlice to reset user state
    4. added handleSignOut function everywhere where signout is required to:
    - send POST request to /api/user/signout
    - dispatch signoutSuccess() on success
}