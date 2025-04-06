# 📝 My Blog 🚀

📂 **Repo:** [GitHub Repository](https://github.com/farmanali6349/my-blog)  
🌐 **Live Link:** Coming very soon when I purchase backend hosting — إِنْ شَاءَ ٱللَّٰهُ

---

## 🌟 Overview

**My Blog** is a **full-stack blogging platform** built using **Node.js**, **Express.js**, **MongoDB**, and **EJS**. It enables users to **create, manage, and interact with blog posts** while focusing on performance, clean architecture, and security.

This project is a showcase of my backend development skills, authentication logic, and ability to build and manage a complete web application using server-side rendering.

---

## 🔥 Features

- ✅ **User Authentication**
  - Signup, Login with **JWT-based sessions**
  - Passwords hashed using **bcrypt**
- ✅ **Post Management**
  - Create, edit, and delete blog posts
  - **Rich-text editing** using TinyMCE
- ✅ **Engagement Tools**
  - Users can like and comment on posts
- ✅ **User Profiles**
  - View author info and all posts they've created
- ✅ **Access Control**
  - Only authenticated users can access create/edit routes
- ✅ **SEO-Friendly URLs**
  - Each blog has a permalink (human-readable slug)

---

## 🚀 Tech Stack

| Tech                   | Description                      |
| ---------------------- | -------------------------------- |
| **Node.js**            | JavaScript runtime               |
| **Express.js**         | Web framework for routing & APIs |
| **MongoDB** + Mongoose | NoSQL Database + Schema modeling |
| **EJS**                | Server-side templating engine    |
| **JWT** + bcrypt       | Secure authentication system     |

---

## 🎬 Demo & Screenshots

🔗 **Live Demo:** _Coming Soon_  
📸 **Screenshots:**

- ![Homepage](./public/assets/images/home.png)
- ![Login Page](./public/assets/images/login.png)
- ![Account Page](./public/assets/images/account.png)
- ![Create Post Page](./public/assets/images/create-post.png)
- ![Post View](./public/assets/images/post.png)

---

## 💻 Installation & Setup

To run this project locally:

```bash
# Clone the repository
git clone https://github.com/farmanali6349/my-blog.git

# Navigate into the project directory
cd my-blog

# Install backend dependencies
npm install

# Configure your environment variables
cp .env.example .env
# Then open .env and fill in your MongoDB URI, JWT secrets, etc.

# Start the server (with nodemon in dev)
npm run dev
```

### 📂 Folder Structure

```
📂 my-blog
├── 📁 src
│ ├── 📁 controllers # Core business logic
│ ├── 📁 middlewares # JWT/auth utilities
│ ├── 📁 models # MongoDB Schemas (User, Blog, etc.)
│ ├── 📁 routes # Route definitions
│ └── 📁 views # EJS templates for UI
├── 📁 public # Static files (CSS, JS, Images)
├── .env.example # Environment config template
├── package.json # Project metadata and dependencies
└── README.md # You're here!
```

---

## 👤 Author

- **Farman Ali**
- 🌐 [farmanali.fun](https://farmanali.fun)
- 🐙 [GitHub](https://github.com/farmanali6349)

---
