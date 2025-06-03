import { Box, Typography, Divider } from "@mui/material";

const OpenEndedResult = ({ question, index }) => {
    const isCorrect = question.correctAnswer?.toLowerCase().trim() === question.userAnswer?.toLowerCase().trim();

    return (
        <Box sx={{ border: "1px solid #ccc", borderRadius: "12px", p: 2, backgroundColor: "#fafafa", mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
                Question {index + 1}
            </Typography>
            <Box sx={{ ml: 1, mb: 2 }} dangerouslySetInnerHTML={{ __html: question.text }} />
            <Divider sx={{ mb: 1 }} />
            <Typography variant="body1" sx={{ backgroundColor: isCorrect ? "#d0f0c0" : "#ffd6d6", p: 1, borderRadius: 1 }}>
                Your Answer: {question.userAnswer || "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Correct Answer: {question.correctAnswer}
            </Typography>
        </Box>
    );
};

export default OpenEndedResult;
