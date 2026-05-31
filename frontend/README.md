# QuizGame

University project — a full-stack quiz application built with React Native (Expo) and Node.js.

## Tech Stack

+ Frontend: React Native + Expo
+ Backend: Node.js + Express
+ Database: MongoDB Atlas

## Features

+ User registration and login
+ Browse and select available quizzes
+ Multiple-choice quiz gameplay
+ Score tracking and statistics

## API Endpoints

+ POST: `/api/auth/register` (Register a new user)
+ POST: `/api/auth/login` (Login)
+ DELETE: `/api/auth/:id` (Delete user)
+ GET: `/api/quizzes` (Get all quizzes)
+ POST: `/api/quizzes` (Create a quiz)
+ PUT: `/api/quizzes/:id` (Update a quiz)
+ POST: `/api/scores` (Save a score)
+ GET: `/api/scores/leaderboard` (Get leaderboard)

## Running the App

### Backend

cd backend
npm install
node server.js

Server runs on `http://localhost:5000`.

### Frontend

cd frontend
npm install
npx expo start

Open in browser with `w`, or scan the QR code with Expo Go.
