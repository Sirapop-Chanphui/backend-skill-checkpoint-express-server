import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import answersValidation from "../middlewares/answersValidation.mjs";

const answersRouter = Router();

//Create an answer for a question
answersRouter.post("/:questionId/answers", answersValidation, async (req, res) => {
    try {
        const { questionId } = req.params;
        const { content } = req.body;

        // Insert answer only if the question exists (single query)
        const result = await connectionPool.query(
            `
          INSERT INTO answers (question_id, content)
          SELECT id, $2
          FROM questions
          WHERE id = $1
          RETURNING id
          `,
            [questionId, content]
        );

        // If no row was inserted, the question does not exist
        if (result.rowCount === 0) return res.status(404).json({ "message": "Question not found." });


        return res.status(201).json({ "message": "Answer created successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Unable to create answers." });
    }
}
);

//Get answers for a question
answersRouter.get("/:questionId/answers", async (req, res) => {
    try {
        const { questionId } = req.params;

        // 1. check question exists
        const questionResult = await connectionPool.query(
            `
        SELECT id
        FROM questions 
        WHERE id = $1
             `,
            [questionId]
        );

        if (questionResult.rows.length === 0) {
            return res.status(404).json({ "message": "Question not found." });
        }

        // 2. fetch answers
        const answersResult = await connectionPool.query(
            `
        SELECT id, content
        FROM answers
        WHERE question_id = $1
        ORDER BY id ASC
           `,
            [questionId]
        );

        return res.status(200).json({
            data: answersResult.rows,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Unable to fetch answers." });
    }
});

//Delete answers for a question
answersRouter.delete("/:questionId/answers", async (req, res) => {
    try {
        const { questionId } = req.params;

        const result = await connectionPool.query(
            `
        DELETE FROM answers
        WHERE question_id = $1
        RETURNING question_id
        `,
            [questionId]
        );

        if (result.rowCount === 0) {
            // could mean: no answers OR question not exist
            const questionCheck = await connectionPool.query(
                `SELECT id FROM questions WHERE id = $1`,
                [questionId]
            );

            if (questionCheck.rows.length === 0) {
                return res.status(404).json({ "message": "Question not found." });
            }
        }

        return res.status(200).json({ "message": "All answers for the question have been deleted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Unable to delete answers." });
    }
});

answersRouter.post("/:answerId/vote", async (req, res) => {
    try {
        const { answerId } = req.params;
        const { vote } = req.body;

        if (vote !== 1 && vote !== -1) {
            return res.status(400).json({ message: "Invalid vote value." });
        }

        // check answer exists
        const answerCheck = await connectionPool.query(
            `SELECT id FROM answers WHERE id = $1`,
            [answerId]
        );

        if (answerCheck.rows.length === 0) {
            return res.status(404).json({ message: "Answer not found." });
        }

        // record vote
        await connectionPool.query(
            `
        INSERT INTO answer_votes (answer_id, vote)
        VALUES ($1, $2)
        `,
            [answerId, vote]
        );

        return res.status(200).json({"message": "Vote on the answer has been recorded successfully."});
    } catch (error) {
        console.error(error);
        return res.status(500).json({"message": "Unable to vote answer."});
    }
});



export default answersRouter;
