const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Mock database
let exams = [
    { id: 1, name: "Exam 1", questions: [{ question: "Question 1?", options: ["Option 1", "Option 2", "Option 3"], answer: 0 }, { question: "Question 2?", options: ["Option 1", "Option 2", "Option 3"], answer: 1 }] },
    { id: 2, name: "Exam 2", questions: [{ question: "Question 1?", options: ["Option 1", "Option 2", "Option 3"], answer: 0 }, { question: "Question 2?", options: ["Option 1", "Option 2", "Option 3"], answer: 2 }] }
];

// API for fetching list of exams
app.get('/exams', (req, res) => {
    res.json(exams);
});

// API for fetching exam details by ID
app.get('/exams/:id', (req, res) => {
    const examId = parseInt(req.params.id);
    const exam = exams.find(exam => exam.id === examId);
    if (exam) {
        res.json(exam);
    } else {
        res.status(404).json({ message: 'Exam not found' });
    }
});

// API for submitting exam answers and calculating result
app.post('/exams/:id/submit', (req, res) => {
    const examId = parseInt(req.params.id);
    const submittedAnswers = req.body.answers; // assuming request body contains an array of submitted answers
    const exam = exams.find(exam => exam.id === examId);
    if (!exam) {
        res.status(404).json({ message: 'Exam not found' });
        return;
    }

    // Calculate score
    let score = 0;
    for (let i = 0; i < submittedAnswers.length; i++) {
        const submittedAnswer = submittedAnswers[i];
        const correctAnswer = exam.questions[i].answer;
        if (submittedAnswer === correctAnswer) {
            score++;
        }
    }

    // Prepare result
    const result = {
        totalQuestions: exam.questions.length,
        correctAnswers: score,
        score: (score / exam.questions.length) * 100 // Assuming score is calculated as a percentage
    };

    res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
