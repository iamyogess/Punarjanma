import express from "express"
import Course from "../models/course-model.js"
import { authenticateUser } from "../middleware/auth-middleware.js"
import UserProgress from "../models/user-process-model.js"

const router = express.Router()

// Verify eSewa payment
router.post("/verify-esewa", authenticateUser, async (req, res) => {
  try {
    const { oid, amt, refId } = req.body
    const userId = req.user.id

    // Extract course ID from order ID
    const courseId = oid.split("_")[1]

    // Verify payment with eSewa (simplified version)
    // In production, you should make an actual API call to eSewa
    const isPaymentValid = await verifyEsewaPayment(oid, amt, refId)

    if (isPaymentValid) {
      // Update user progress to premium
      await UserProgress.findOneAndUpdate(
        { userId, courseId },
        {
          isPremium: true,
          premiumPurchasedAt: new Date(),
        },
        { upsert: true },
      )

      // Update course enrollment count if not already enrolled
      const existingProgress = await UserProgress.findOne({ userId, courseId })
      if (!existingProgress || !existingProgress.enrolledAt) {
        await Course.findByIdAndUpdate(courseId, {
          $inc: { enrollmentCount: 1 },
        })
      }

      res.json({
        success: true,
        message: "Payment verified successfully",
        data: {
          courseId,
          isPremium: true,
          premiumPurchasedAt: new Date(),
        },
      })
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    res.status(500).json({
      success: false,
      message: "Payment verification error",
      error: error.message,
    })
  }
})

// Simplified eSewa verification (replace with actual eSewa API call)
async function verifyEsewaPayment(oid, amt, refId) {
  // In production, make actual API call to eSewa verification endpoint
  // For development/testing, we'll simulate successful verification
  console.log("Verifying eSewa payment:", { oid, amt, refId })

  // Simulate verification delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // For demo purposes, always return true
  // In production, implement actual eSewa verification API call
  return true
}

export default router
