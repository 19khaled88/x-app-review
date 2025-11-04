import express from "express";
import cors from "cors";
import helmet from "helmet";
import {
  createReviews,
  deleteAllReviews,
  deleteReview,
  deleteReviews,
  deleteReviewsByEvaluator,
  getAllReviews,
} from "./services/review";
import z from "zod";

const app = express();

const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  try {
    res.json({
      success: true,
      status: "OK",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.json({ success: false, status: "201" });
  }
});

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// get all reviews
app.get("/reviews/all", async (req, res) => {
  try {
    const result = await getAllReviews();
    if (result.success) {
      return res.status(201).json(result);
    } else {
      const statusCode = result.error === "Error unknown" ? 400 : 500;
      return res.status(statusCode).json(result);
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
});

// create review
app.post("/reviews/create", async (req, res) => {
  try {
    const result = await createReviews(req.body);

    if (result.success) {
      return res.status(201).json(result);
    } else {
      const statusCode = result.error === "Validation failed" ? 400 : 500;
      return res.status(statusCode).json(result);
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
});

/**
 * DELETE /api/reviews/:id - Delete single review by ID
 */
const idParamSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive()),
});
app.delete("/reviews/:id", async (req, res) => {
  try {
    const { id } = idParamSchema.parse(req.params);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Review ID is required",
      });
    }

    const result = await deleteReview(id);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      return res.status(404).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Delete review route error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * DELETE /api/reviews - Delete multiple reviews by IDs
 */
app.delete("/some_reviews", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Array of review IDs is required",
      });
    }

    const result = await deleteReviews(ids);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      return res.status(404).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Delete multiple reviews route error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * DELETE /api/reviews/evaluator/:evaluatorId - Delete reviews by evaluator ID
 */
app.delete("/reviews/evaluator/:evaluatorId", async (req, res) => {
  try {
    const { evaluatorId } = req.params;

    if (!evaluatorId) {
      return res.status(400).json({
        success: false,
        error: "Evaluator ID is required",
      });
    }

    const result = await deleteReviewsByEvaluator(evaluatorId);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Delete reviews by evaluator route error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * DELETE /api/reviews - Delete all reviews (DANGEROUS - add authentication!)
 */
app.delete("/reviews", async (req, res) => {
  try {
    const result = await deleteAllReviews();
    if (result.success) {
      return res.status(200).json({
        sucess: true,
        message: result.message,
        data: result.data,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
