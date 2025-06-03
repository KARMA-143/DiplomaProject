import SingleChoiceResult from './SingleChoiceResult';
import MultipleChoiceResult from './MultipleChoiceResult';
import OpenEndedResult from './OpenEndedResult';
import MatchingResult from './MatchingResult';

const TestResults = ({ testWithUserAnswers, testInfo }) => {
    const questionComponents = {
        singleChoice: SingleChoiceResult,
        multipleChoice: MultipleChoiceResult,
        openEnded: OpenEndedResult,
        matching: MatchingResult,
    };

    return (
        <div className="test-results">
            <div style={{ marginBottom: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
                <h2>Test results</h2>
                <p><strong>Mark:</strong> {testInfo?.mark ?? '—'}</p>
                <p><strong>Correct answers:</strong> {testInfo?.correctAnswers}/{testWithUserAnswers?.length}</p>
            </div>

            {testWithUserAnswers.map((question, index) => {
                const Component = questionComponents[question.type];
                return Component ? <Component key={index} question={question} index={index} /> : null;
            })}
        </div>
    );
};

export default TestResults;
