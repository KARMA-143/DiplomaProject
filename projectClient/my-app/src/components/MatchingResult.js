import { Box, Typography, Divider } from "@mui/material";

const MatchingResult = ({ question, index }) => {
    return (
        <Box sx={{ border: "1px solid #ccc", borderRadius: "12px", p: 2, backgroundColor: "#fafafa", mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
                Question {index + 1}
            </Typography>
            <Box sx={{ ml: 1, mb: 2 }} dangerouslySetInnerHTML={{ __html: question.text }} />
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" sx={{ mb: 1 }}>
                Your answers:
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                {question.correctAnswer.map((pair, idx) => {
                    const userPair = question.userAnswer?.[idx];
                    const isCorrect = userPair?.answer === pair.answer;
                    return (
                        <Box
                            key={idx}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                backgroundColor: isCorrect ? "#d0f0c0" : "#ffd6d6",
                                borderRadius: 2,
                                px: 2,
                                py: 1,
                                boxShadow: 1,
                            }}
                        >
                            <Typography variant="body1">{pair.option}</Typography>
                            <Typography variant="body1">→ {userPair?.answer || "—"}</Typography>
                        </Box>
                    );
                })}
            </Box>

            <Divider sx={{ mb: 1 }} />
            <Typography variant="body2" sx={{ mb: 1 }}>
                Correct answers:
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {question.correctAnswer.map((pair, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            backgroundColor: "#f0f0f0",
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                        }}
                    >
                        <Typography variant="body1">{pair.option}</Typography>
                        <Typography variant="body1">→ {pair.answer}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default MatchingResult;
