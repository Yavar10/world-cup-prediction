# 🏆 World Cup Predictor

A beautiful, interactive web application built with React, Vite, and Firebase to predict the outcomes of the FIFA World Cup. Users can forecast group stage standings, select wildcard teams, and navigate through a full knockout bracket all the way to the final.

The application features leaderboard scoring, community voting, and an admin panel to update official tournament results.

## 🚀 Features

- **Interactive Bracket Prediction**: Easy-to-use interface to rank group stage teams, pick 3rd place qualifiers, and select knockout round winners.
- **Leaderboard**: Compete against friends and the global community. Scores are automatically calculated as official results are updated.
- **Community Engagement**: View other users' brackets and upvote or downvote their predictions on the leaderboard.
- **Authentication**: Secure Google Sign-In powered by Firebase Auth.
- **Admin Dashboard**: Authorized users can update the official tournament results or simulate a full tournament, which instantly updates global scores.
- **Responsive Design**: Fully optimized for both desktop and mobile devices, ensuring a seamless experience anywhere.
- **Modern UI**: Polished interface with authentic country flags via `flagcdn`, crisp icons from `lucide-react`, and dynamic user feedback.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Vanilla CSS
- **Backend/Database**: Firebase (Firestore & Authentication)
- **Icons**: Lucide React

## 📋 Scoring System

Users earn points based on how closely their predictions match the official results:

- **Group Stage**: 2 points for exact position, 1 point for correctly predicting a team advances (top 2 or best 3rd).
- **Best Thirds**: 2 points for each correctly identified best 3rd-place team.
- **Knockout Stage**: Increasing points for correctly predicting winners in each round (R32: 5pts, R16: 8pts, QF: 12pts, SF: 20pts, Final: 30pts).
- **Bonus Points**: Additional points for correctly predicting tournament finalists and the runner-up.

## ⚙️ Local Development Setup

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Create a `.env` file at the root of the project with your Firebase configuration and admin email:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # Unlocks the Admin Panel for this specific Google account
   VITE_ADMIN_EMAIL=your_admin_email@gmail.com
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
