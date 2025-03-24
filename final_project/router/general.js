const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();






const doesExist = (username) => {
    
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}



public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  console.log("hit")
  try {
    const bookPromise = new Promise((resolve) => {
      resolve(books);
    });

    const bookData = await bookPromise;

    return res.status(200).json({ message: bookData });
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({ message: 'Error fetching books' });
  }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   function getBookByISBN(isbn) {
//     let results = {};
//     for (let key in books) {
//       if (books.hasOwnProperty(key) && books[key].isbn === isbn) {
//         results[key] = books[key];
//       }
//     }
//     return results;
//   }
//   let isbn = req.params.isbn;
//   let book = getBookByISBN(isbn)
//   if(book){
//     return res.status(200).json({message: book});
//   }
  
//  });
  
public_users.get('/isbn/:isbn',function (req, res) {
  function getBookByISBN(isbn) {
    let results = {};
    for (let key in books) {
      if (books.hasOwnProperty(key) && books[key].isbn === isbn) {
        results[key] = books[key];
      }
    }
    return results;
  }
  let isbn = req.params.isbn;
  let book = getBookByISBN(isbn)
  if(book){
    return res.status(200).json({message: book});
  }
  
 });
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const authorName = req.params.author;
//   const results = {};

//   for (const key in books) {
//     if (books.hasOwnProperty(key) && books[key].author === authorName) {
//       results[key] = books[key];
//     }
//   }

//   return res.status(200).json({message: results});
// });
public_users.get('/author/:author', async (req, res) => {
  const authorName = req.params.author;

  try {
    const bookPromise = new Promise((resolve, reject) => {
      const results = {};
      let found = false;

      for (const key in books) {
        if (books.hasOwnProperty(key) && books[key].author === authorName) {
          results[key] = books[key];
          found = true;
        }
      }

      if (found) {
        resolve(results);
      } else {
        reject(new Error("Author not found"));
      }
    });

    const bookData = await bookPromise;

    return res.status(200).json({ message: bookData });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});
// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;
//   const results = {};

//   for (const key in books) {
//     if (books.hasOwnProperty(key) && books[key].title === title) {
//       results[key] = books[key];
//     }
//   }

//   return res.status(200).json({message: results});
// });
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const bookPromise = new Promise((resolve, reject) => {
      const results = {};
      let found = false;

      for (const key in books) {
        if (books.hasOwnProperty(key) && books[key].title === title) {
          results[key] = books[key];
          found = true;
        }
      }

      if (found) {
        resolve(results);
      } else {
        reject(new Error("Title not found"));
      }
    });

    const bookData = await bookPromise;

    return res.status(200).json({ message: bookData });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  results = {};

  for (const key in books) {
    if (books.hasOwnProperty(key) && books[key].isbn === isbn) {
      results[key] = books[key].reviews;
    }
  }

  return res.status(200).json({message: results});
});

module.exports.general = public_users;
