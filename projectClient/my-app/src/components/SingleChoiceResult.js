import { Box, Typography, Divider, RadioGroup, FormControlLabel, Radio } from "@mui/material";

const SingleChoiceResult = ({ question, index }) => {
    const userAnswer = question.userAnswer;

    return (
        <Box sx={{ border: "1px solid #ccc", borderRadius: "12px", p: 2, backgroundColor: "#fafafa", mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>
                Question {index + 1}
            </Typography>
            <Box sx={{ ml: 1, mb: 2 }} dangerouslySetInnerHTML={{ __html: question.text }} />
            <Divider sx={{ mb: 1 }} />

            {userAnswer==='' ? (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    You did not answer this question.
                </Typography>
            ) : null}

            <RadioGroup value={userAnswer}>
                {question.options.map((option, idx) => {
                    let bg = "transparent";

                    if (+userAnswer === idx && idx !== question.correctAnswer) {
                        bg = "#ffd6d6";
                    }

                    if ( idx === question.correctAnswer) {
                        bg = "#d0f0c0";
                    }

                    return (
                        <Box key={idx} sx={{ backgroundColor: bg, borderRadius: 1, p: 1, mb: 1 }}>
                            <FormControlLabel
                                value={idx}
                                control={<Radio disabled />}
                                label={option}
                            />
                        </Box>
                    );
                })}
            </RadioGroup>
        </Box>
    );
};

export default SingleChoiceResult;