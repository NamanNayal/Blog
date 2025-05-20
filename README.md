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

19. DashPosts component {
    - Import React, useEffect, useState,            useSelector, and Link.
    - Get currentUser from Redux store.
    - Define state to hold posts (userPosts).
    - On mount, check if user is admin.
    - If admin, fetch posts using currentUser._id.
    - Await response and update userPosts state if successful.
    - Log errors if fetch fails.
    - Render two UI layouts based on screen size:
        • Mobile view – card layout for each post.
        • Desktop view – table format for posts.
    - Show post image, title (linked), updated date, category, and edit/delete options.
    - Show fallback text if no posts found.
}

20.Add show more Functionality {
    =Set `startIndex` to the current length of `userPosts`.
    -Fetch posts starting from `startIndex` with `userId` and `startIndex` as query parameters.
    -Parse the response as JSON.
    -If the response is successful, append the new posts to `userPosts`.
    -If the number of new posts is less than 9, set `setShowMore` to false.
    -Log any errors that occur during the fetch.
}

21. Delete Post {
    -create router for delete request
    -pass two things userId and postId to be sure if the owner of the post is deleting it, verify the user if it is admin, and then handle the delete function
    -check if user is admin and userId matches the req.params
    -perform findByIdDelete() operation
    
    -every time user click the delete button we want a modal to show up which ask for confirmation
    -we want to handleDeletePost function if user confirms
    
    handleDeletePost
        -setModal to false
        -send a req to api with postIdToDelete and currentUserId with a HTTP DELETE method
        -if res.ok then we want to setUserPosts filtering them by only keeping post that does not matches the postIdToDelete

}

22. Update Post{
    - similar to create post page
    - route should be private and available to only admin
    - extract postId from params using useParams
    - using useEffect we want to get the post detail of the postId we extracted, and update our forData values and set Error based on that
    - we need to create an api route to update the post which dynamically gets postId and userId from the params
    - in updatepost controller we want to check if the user is admin, and the user is the owner of the post
    - we ensure that only title,content,category and image are only read by the body and gets updated,
    - we also ensure that image from the body is read in case its not an empty string and it exist 
    - the Post model we created we will use a method findbyIdandUpdate by giving two parameters id and data to be updated
    - the id will come from the params dynamically and the updated data object will be passed
    - we will send the res with status and updated data
    

    Fixes 
    1. default image from MongoDB model {
        - in previous logic we were receiving img from body, which was getting overrided by and empty string, so this time we handle the img only when its a non empty string
    } 
    2. Empty string values are being passed to img{
        - while passing values to img there were few post with empty string, so we added a condition if its empty then use null
    }
}

23. Get User API {
    - add a getuser route, which verifies the token and call getUser function
    - verify if user isAdmin
    - declare the startIndex, the limit and the sorting direction
    - use Find method on user schema with then sort,skip and limit usig declared variables
    - we want user doc to be send without password hence we will destructure the password and return the rest of the data
    - we will use countDocument method to return total users
    - we will also find lastMonthUsers 
    - and send all of these back in response
}

24. User UI functionality{
    - in dashside bar add a new list item users
    - add a new tab users which loads component dashUsers
    - use useSelector to get the currentUser and current theme from Redux store
    - define local states:
    - users for storing fetched users
    - showMoreUser to manage "Show More" button visibility
    - showDeleteModal and userIdToDelete for deletion logic
    - in useEffect:
    - call /api/user/getusers to fetch users if current user is admin
    - update users state with data
    - check data.posts.length to control showMoreUser visibility 
    - define handleShowMoreUsers:
    - calculate startIndex as users.length
    - call /api/user/getusers?start=startIndex to fetch next batch
    - append users using spread operator
    - check if new batch has fewer than 9 users to hide "Show More" button
    - define empty handleDeleteUser to implement delete logic later
    - return two layout blocks:
    - mobile layout: user info cards
    - desktop layout: user info table
    - both show user image, email, username, role (Admin/User), and delete button
    - render "Show More" button conditionally based on showMoreUser
    - show delete confirmation modal when delete clicked
    - Confirm triggers handleDeleteUser
    - Cancel closes modal

}

25. delete User{
    - validate if user is a admin, or the owner
    - fun call which uses the delete api, which dynamically fetches the user by params, calls a HTTP method DELETE
    - if we get a response ok we filter out the userIdToDelete from the rest user

}

26. complete post page functionality{
    - create a route for postPage    
    - state for loading, error and postdata & postSlug from params 
    - fun to fetch post which dynamically takes slug from params and send a req to the api
    - once done we update the Post state with the received element in the array
}

27. call to action{
    - create a reusable UI element designed to prompt users to take a specific action
    - one parent div, two child div
    - one div for text content
    - second div for img
}

28. {
    - scroll to top component which uses pathname from useLocation, to track any changes made to url and useeffect on ever render uses window scrollTo fuction to bring the window on top everytime
    - create a commentSection component which takes postId as params
        - check if user is signed and render UI accordingly
        - state for commentError, comment Content
        - a handle submit handler which is a async function,
            - checks comment length
            - set error state to null
            - send req to api, and make a POST call, send a header(informs the server about the format of the data being sent.) which tells { 'Content-Type': 'application/json' } sending a JSON data in the req body, In body we are converting js object to JSON string if we dont do this the req will fail
            - we recive the response object which is a object and not actual data, so we use res.json() provided by fetch to JSON string → JS object
            - based on response we handle our state
        

    API {
        - create a comment route
        - call the post function to the create route, which verify user is signed in and call creeatecomment function
        - destructure the content, postid and userid from the body, 
        -check if the userid matches the signed in user
        - create a new instance of our model Comment with content,postid and useId as properties
        - then save them in the db and send the response back

        create comment Model
    } 
    
}

29. show the comment of a post {
    - create api route which gets the comment
    - create a getPostComments route which gets the comments dynamically based on the postId, and does not need to verifyToken and is available to see for all
    - getPostComments => use find method on Comment model to search comment based on postId parameter and sort it.
    - now we have the api route we want to show it inside comment sections
    - CommentSection.jsx we want to req all the comment based on that postId, and set them in new State, if the res is okay, based on the response and comment length we want to load our ui accordingly and then use another Component Comment.jsx to map and load each comment 
    {
        - comments.map(...): loops through an array of comments.
        - <Comment ... />: renders a Comment component for each one.
        - key={comment._id}: uniquely identifies each item for React.
        - comment={comment}: passes the whole comment object as a prop.
    }
    - Comment component => a comment object is passed in the component and we get our userId from there, which we can use to get user info,
    - create a route which get the user, without the need of verifying the token. and take userId dynamically
    - getUser => find user by the Id in User Model recived in the params, and we destructure the object recived and remove the password and send the rest data,
    - In Comment component we want to getUser by sending the req to our getUser api and send userId dynamically from the comment object recived , and save the data in the use state, also using the save data in user state update the profilepicture, time created 
    - while submitting the comment we want out latest comment to be ahead of the previous comments  setComments([data, ...comments]);

}