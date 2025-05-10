Node Js Practical Exam :- 

Recipe Sharing Platform Project Outline with JWT, Cookie, Role-Based Access, Multiuser Support, Populate, Navbar, and Culinary Theme (Within 50 points)



1.  Project Setup (5 points) 

   - Initialize a new Node.js project.

   - Install necessary dependencies: `express`, `ejs`, `body-parser`, `mongoose`, `jsonwebtoken`, `cookie-parser`, etc.

   - Set up a basic server using Express.



2.  Model - MongoDB Setup (5 points) 

   - Set up a MongoDB database to store recipe data.

   - Create collections for recipes, users, and comments.

   - Define Recipe, User, and Comment models using Mongoose.



3.  Model - User Model with Roles (5 points) 

   - Enhance the User model to include fields such as `username`, `password`, `role`, etc.

   - Implement role-based access control (e.g., roles: `admin`, `user`).

   - Hash and store user passwords securely in the database.



4.  Controller - Authentication (10 points) 

   - Create controllers for user registration (`/register`) and login (`/login`).

   - Implement a JWT token issuance upon successful login and send it as a cookie to the client.

   - Store user roles in the JWT payload.

   - Configure the server to use `cookie-parser` for parsing cookies.

   - Implement a route to handle user logout and clear the JWT token cookie.



5.  Middleware and Routing (10 points) 

   - Create middleware to check for the presence and validity of JWT tokens.

   - Implement a middleware to extract user information from the token and attach it to the request object.

   - Use middleware to protect routes that require authentication.

   - Define routes for rendering views and handling CRUD operations on recipes and comments.

   - Ensure that routes are protected based on user roles.



6.  Model - Fetching and Displaying User-Specific Recipes (10 points) 

   - Update the User model to include a reference or array of associated recipes.

   - Ensure that all recipes can be retrieved for an authenticated user.

   - Modify routes to handle multiuser support.


7.  View Structure (5 points) 

   - Create the necessary views using EJS:

     - `recipeList.ejs` (to display all recipes)

     - `myRecipes.ejs` (to display recipes submitted by the logged-in user)

     - `recipeForm.ejs`

     - `recipeItem.ejs`

     - `navbar.ejs` (for navigation)

     - `login.ejs`

     - `register.ejs`



8.  Culinary Theme (5 points) 

   - Implement a culinary-themed design for the recipe-sharing platform.

   - Use food-related images, colors, and fonts to create a culinary atmosphere.

   - Ensure a visually appealing layout for recipe cards and details.



9.  Navbar (5 points) 

   - Create a `navbar.ejs` partial for navigation.

   - Include links to the recipe list, user-specific recipes, recipe form, and a sign-out option (if applicable).

   - Ensure the navbar aligns with the culinary theme.



User:- 
   post :- http://localhost:8009/auth/register
   Post :- http://localhost:8009/auth/login
   Post :- http://localhost:8009/auth/logout
   Get :- http://localhost:8009/auth/profile
   Post :- http://localhost:8009/auth/forgot-password
   Post :- http://localhost:8009/auth/change-password
   Post :- http://localhost:8009/auth/reset-password/681ee4d78f08b78a702ccfb8
   Put :- http://localhost:8009/auth/profile
   Get :- http://localhost:8009/auth/admin/users
   Delete :- http://localhost:8009/auth/admin/users/681ee4d78f08b78a702ccfb8
   Post :- http://localhost:8009/auth/upload-profile-picture

Recipe :-
   Get:- http://localhost:8009/recipes/
   Post :- http://localhost:8009/recipes/create
   Get :- http://localhost:8009/recipes/my/allrecipes
   Get :- http://localhost:8009/recipes/681f0706acc4cf5a918c1065
   Put :- http://localhost:8009/recipes/681f0706acc4cf5a918c1065
   Delete :- http://localhost:8009/recipes/681f0706acc4cf5a918c1065

Comments :-
   Get :- http://localhost:8009/comments/681f069cacc4cf5a918c1062
   Post :- http://localhost:8009/comments/681f069cacc4cf5a918c1062
   Delete :- http://localhost:8009/comments/681f0b7cd0342e0e1d76b7af
