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

12. Add Admin Functionality to the User{
    1. Add a field (isAdmin) in the Schema with the option
    2. we dont want our frontend to make changes to isAdmin and let mongodn handle it to prevent previlege abuse, enforced controlled access and keep the app secure and maintainable.
    3. Adding isAdmin as a key-value pair in the JWT token makes role-based access control faster, cleaner, and scalable, without compromising security — as long as your JWT secret stays secure.
}

13. create post page UI{
    1. we want to ensure only admin can access the create post page, we want to create a route which will verify the user and then load the component
    2. we will very from redux state if the current user exist and is a admin if yes then we want him to redirect to the create post page else redirect to sign in
    3. to create a post page UI we will use flowbite components
}

14. Create Post API{
    1. check for the admin, check browser for cookie 
    2. we want to define a Post Schema 
    3. we will create a seperate route for post api,
    4. we want to ensure the user who create the post should be logged in and must be a admin
    5. check for validations, like is admin, title and content present, and for a UrL friendly version for title create a slug (It’s typically lowercase, uses hyphens instead of spaces, and removes special characters.)
    6. and save the Post in the db
}

15. Handle Image {
    1. create state for
        -storing actual image
        -for image preivew
        -tracking uploading status
        -for formData which uses a object to store
    
    2. handleUploadImage an async call
        -check if image exisit to upload
        -create a in built js FormData object and add key value pairs of file and preset, and then make a HTTP request to cloudinary api sending the data, once we recive a response we want to update it into formData, with live url which then can be used for preview and storing in db, and finally handling state like uploading and error, and similar state handle in catch
    
    3. Image Upload Ui 
        -User selects a file.
        -selectedFile = e.target.files[0]
        -FileReader() instance is created.
        -You define onload = (event) => {            setFilePreview(event.target.result) }
        -Then: reader.readAsDataURL(selectedFile)
        -FileReader reads file in background.
        -When done, onload fires.
        -Base64 string appears in event.target.result.
        -You store it in state → component re-renders → image is previewed.

    4. -Check if filePreview exists and render the preview image if true.
       -If not, check if formData.image exists and render the uploaded image if true.
       -If neither exists, render the default upload interface.
       -if image is being uploaded or error exisit we want to show a alert or loading component
}

16. Publishing a post  {
    1. add event lstener on text-editor, select-category, title and update forData with a key value pair
    2. finnally a event listener on form
        - a HTTP POST req to create api, sending a js object by converting it to JSON string
        - convert response from a JSON string to js object and store it in a variable
        - a state for handling error while submitting form
        -if res is ok we navigate to another page, and state to null
        -API returned an error code	if (!res.ok)
        Network/JS error occurred	catch block
    
    3.      Purpose             InitialState
            Waiting for data	    null
            Object with fields	    {}
            List of things	        []
            Text field	            ''
            Toggle / flag	      true/false


}
17. add post section to the dashboard {
    1. create a Dashboard Post Component
    2. get currentUser, if currentUser.isAdmin, then we want to load a list which links the dashpost,
    3. we are tracking url parameters with tab state, using useLocation and URLSearchParams(), if tab value is posts then we want to load DashPosts
}

18. getpost api{
    -Parse pagination and sort params.
    -Build dynamic filter object from query.
    -Fetch filtered posts with sort, skip, and limit.
    -Count total posts.
    -Calculate date for one month ago.
    -Count posts created in the last month.
    -Return all data in JSON response.
    -Catch and forward any errors.
}
