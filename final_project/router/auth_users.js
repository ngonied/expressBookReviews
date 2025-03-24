const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session');

let users = [];

const isValid = (username)=>{ 
  let currentUser = users.filter((user)=>{
    return user.username === username;
  });
  if(currentUser.length>0){
      return true;
  }else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validUsers = users.filter((user)=>{
      return (user.username === username && user.password === password);
    });

    if (validUsers.length>0){
      return true;
    }else{
      return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
    }

    if(authenticatedUser(username, password)){
      let accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 *60});
      req.session.authorization = {
        accessToken, username
      }
      return res.status(200).json({message: "User successfully logged in"});
    }else{
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  const isbn = req.params.isbn;
  let bookFound = false;
  console.log("hit");
  const username = req.session.authorization['username']
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  for (const key in books) {
    if (books.hasOwnProperty(key) && books[key].isbn === isbn) {
      books[key].reviews[username] = review; // Add or modify review
      bookFound = true;
      return res.status(200).json({ message: "Review updated successfully" });
    }
  }

  if (!bookFound) {
    return res.status(404).json({ message: "Book not found" });
  }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username']; // Get username from session

  console.log("DELETE /auth/review/:isbn hit");
  console.log("ISBN:", isbn);
  console.log("Username:", username);

  let bookFound = false;
  for (const key in books) {
    if (books.hasOwnProperty(key) && books[key].isbn === isbn) {
      if (books[key].reviews[username]) {
        delete books[key].reviews[username]; // Delete the user's review
        bookFound = true;
        console.log("Review deleted successfully");
        return res.status(200).json({ message: "Review deleted successfully" });
      } else {
        console.log("Review not found for this user");
        return res.status(404).json({ message: "Review not found for this user" });
      }
    }
  }

  if (!bookFound) {
    console.log("Book not found");
    return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
