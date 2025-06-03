import { Box, Typography, Divider, FormGroup, FormControlLabel, Checkbox } from "@mui/material";

const MultipleChoiceResult = ({ question, index }) => {
    const userAnswer = question.userAnswer || [];

    const userDidNotAnswer = userAnswer.length === 0;

    return (
        <Box sx={{ border: "1px solid #ccc", borderRadius: "12px", p: 2, backgroundColor: "#fafafa", mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
                Question {index + 1}
            </Typography>
            <Box sx={{ ml: 1, mb: 2 }} dangerouslySetInnerHTML={{ __html: question.text }} />
            <Divider sx={{ mb: 1 }} />

            {userDidNotAnswer && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    You did not answer this question.
                </Typography>
            )}

            <FormGroup>
                {question.options.map((option, idx) => {
                    const isCorrect = question.correctAnswer.includes(idx);
                    const isSelected = userAnswer.includes(idx);
                    let bg = "transparent";

                    if (!isCorrect && isSelected) {
                        bg = "#ffd6d6";
                    } else if (isCorrect) {
                        bg = "#d0f0c0";
                    }

                    return (
                        <Box key={idx} sx={{ backgroundColor: bg, borderRadius: 1, p: 1, mb: 1 }}>
                            <FormControlLabel
                                control={<Checkbox checked={isSelected} disabled />}
                                label={option}
                            />
                        </Box>
                    );
                })}
            </FormGroup>
        </Box>
    );
};

export default MultipleChoiceResult;
