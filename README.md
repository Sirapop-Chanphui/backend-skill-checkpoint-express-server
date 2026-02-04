# Backend Skill Checkpoint – Express Server 👋

## Description
A RESTful API for a Q&A platform where users can create questions,
post answers, and manage content by category.

This project was built as part of a backend skill checkpoint to practice
REST API design, database relationships, and Express.js structure.

## Features
- Create, read, update, and delete questions
- Search questions by title or category
- Create and view answers for a specific question
- Delete a question along with its related answers

## Tech Stack
- Node.js
- Express.js
- PostgreSQL (supabase)
- dotenv

## Install
```sh
npm install
```

## Usage
```sh
npm run start
```

## Questions
- POST /questions

- GET /questions

- GET /questions/:questionId

- PUT /questions/:questionId

- DELETE /questions/:questionId

- GET /questions/search?title=&category=

## Answers
- POST /questions/:questionId/answers

- GET /questions/:questionId/answers

## Environment Variables
This project uses PostgreSQL via Supabase.

Create a `.env` file in the root directory and add:

```env
PORT=4000
DATABASE_URL=your_supabase_database_url
```

## Roadmap (Future Improvements)
- Add voting system for questions and answers
- Enforce one vote per user per question/answer
- Add Swagger API documentation
- Add authentication & authorization
- Deploy to Vercel

## Author

👤 **Sirapop Chanphui**

* Github: [@Sirapop-Chanphui](https://github.com/Sirapop-Chanphui)
