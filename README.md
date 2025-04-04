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