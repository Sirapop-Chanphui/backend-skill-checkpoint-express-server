import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import questionsValidation from "../middlewares/questionsValidation.mjs";

const questionsRouter = Router();

//Search questions by title or category
questionsRouter.get("/search", async (req, res) => {
    try {
        let { title, category } = req.query;

        if (!title && !category) {
            return res.status(400).json({"message": "Invalid search parameters."});
        }

        let query = `
        SELECT id, title, description, category
        FROM questions
      `;

        const conditions = [];
        const values = [];

        if (title) {
            values.push(`%${title}%`);
            conditions.push(`title ILIKE $${values.length}`);
        }

        if (category) {
            values.push(category);
            conditions.push(`category = $${values.length}`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ")
        }

        const result = await connectionPool.query(query, values);

        return res.status(200).json({ data: result.rows,});
    } catch (error) {
        console.error(error);
        return res.status(500).json({"message": "Unable to fetch a question."});
    }
});

// get all questions
questionsRouter.get("/", async (req, res) => {
    try {
        const result = await connectionPool.query(`
        SELECT *
        FROM questions
      `);
        return res.json({ data: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Unable to fetch questions." });
    }
});

// get question by id
questionsRouter.get("/:questionId", async (req, res) => {
    try {
        const { questionId } = req.params;
        const result = await connectionPool.query(`
        SELECT *
        FROM questions
        WHERE id = $1
      `, [questionId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ "message": "Question not found." });
        }

        return res.json({ data: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Unable to fetch question." });
    }
});

// post new question
questionsRouter.post("/", questionsValidation, async (req, res) => {
    try {
        const { title, description, category } = req.body;

        // ✅ insert to database
        await connectionPool.query(
            `
        INSERT INTO questions (title, description, category)
        VALUES ($1, $2, $3)
        `,
            [title, description, category]
        );

        return res.status(201).json({ "message": "Question created successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Unable to create question." });
    }
});

// update question
questionsRouter.put("/:questionId", questionsValidation, async (req, res) => {
    try {
        const { questionId } = req.params;
        const { title, description, category } = req.body;

        const result = await connectionPool.query(
            `
          UPDATE questions
          SET title = $1,
              description = $2,
              category = $3
          WHERE id = $4
          `,
            [title, description, category, questionId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ "message": "Question not found." });
        }

        return res.status(200).json({ "message": "Question updated successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Unable to fetch questions." });
    }
}
);

// delete question
questionsRouter.delete("/:questionId", async (req, res) => {
    try {
        const { questionId } = req.params;

        const result = await connectionPool.query(
            `
        DELETE FROM questions
        WHERE id = $1
        `,
            [questionId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Question not found.",
            });
        }

        return res.status(200).json({
            message: "Question post has been deleted successfully.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to delete question.",
        });
    }
});

//Vote on a question
questionsRouter.post("/:questionId/vote", async (req, res) => {
    try {
      const { questionId } = req.params;
      const { vote } = req.body;
  
      // 1️⃣ validate vote
      if (vote !== 1 && vote !== -1) {
        return res.status(400).json({
          message: "Invalid vote value.",
        });
      }
  
      // 2️⃣ insert vote (only if question exists)
      const result = await connectionPool.query(
        `
        INSERT INTO question_votes (question_id, vote)
        SELECT id, $2
        FROM questions
        WHERE id = $1
        RETURNING id
        `,
        [questionId, vote]
      );
  
      // 3️⃣ question not found
      if (result.rowCount === 0) {
        return res.status(404).json({
          message: "Question not found.",
        });
      }
  
      return res.status(200).json({
        message: "Vote on the question has been recorded successfully.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Unable to vote question.",
      });
    }
  });



export default questionsRouter