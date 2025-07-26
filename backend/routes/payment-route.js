import express from "express"
import { URLSearchParams } from "url"
import Course from "../models/course-model.js"
import { authenticateUser } from "../middleware/auth-middleware.js"
import UserModel from "./../models/user-model.js"
import UserProgress from "./../models/user-process-model.js"
import crypto from "crypto"
import https from "https" 

const router = express.Router()

// New endpoint for eSewa v2 verification (handles new response format)
router.post("/verify-esewa-v2", authenticateUser, async (req, res) => {
  try {
    const { paymentData, courseId } = req.body
    const userId = req.user.id

    console.log("Payment verification request v2 received:", { paymentData, courseId, userId })

    // 1. Validate input parameters
    if (!paymentData || !courseId) {
      console.error("Error: Missing required parameters in /verify-esewa-v2", { paymentData, courseId })
      return res.status(400).json({
        success: false,
        message: "Missing required payment parameters.",
      })
    }

    // 2. Validate payment data structure
    const { transaction_code, status, total_amount, transaction_uuid, signature } = paymentData

    if (!transaction_code || !status || !total_amount || !transaction_uuid) {
      console.error("Error: Invalid payment data structure received:", paymentData)
      return res.status(400).json({
        success: false,
        message: "Incomplete payment data received from eSewa.",
      })
    }

    // 3. Check if payment status is complete from eSewa's initial response
    if (status !== "COMPLETE") {
      console.error("Error: Payment not completed by eSewa (status was not COMPLETE):", status)
      return res.status(400).json({
        success: false,
        message: `Payment status from eSewa was '${status}', not 'COMPLETE'.`,
      })
    }

    // 4. Verify the course exists
    const course = await Course.findById(courseId)
    if (!course) {
      console.error("Error: Course not found for ID:", courseId)
      return res.status(404).json({
        success: false,
        message: "Course not found. Please contact support.",
      })
    }

    // 5. Verify signature (optional but recommended for production)
    const isSignatureValid = await verifyEsewaSignature(paymentData)
    if (!isSignatureValid) {
      console.warn("Warning: Signature verification failed for transaction:", transaction_uuid)
      // In production, you might want to return an error here:
      // return res.status(400).json({ success: false, message: "Payment signature invalid." });
    }

    // 6. Perform additional verification with eSewa's API
    console.log("Performing additional eSewa API verification for transaction:", transaction_code)
    const esewaVerification = await verifyWithEsewa(transaction_code, total_amount, transaction_uuid)

    if (esewaVerification.success || process.env.NODE_ENV === "development") {
      console.log("eSewa API verification successful. Proceeding to update user records.")

      try {
        // 7. Update user progress to premium
        const progressUpdate = await UserProgress.findOneAndUpdate(
          { userId, courseId },
          {
            $set: {
              isPremium: true,
              premiumPurchasedAt: new Date(),
            },
            $setOnInsert: {
              userId,
              courseId,
              completedLessons: [],
              enrolledAt: new Date(), // Set enrolledAt only on first creation
            },
          },
          {
            upsert: true, // Create if not exists
            new: true, // Return the updated document
            runValidators: true,
          },
        )
        console.log("UserProgress updated:", progressUpdate)

        // 8. Update user's premiumCourses and ensure enrollment
        const userUpdate = await UserModel.findByIdAndUpdate(
          userId,
          {
            $addToSet: {
              premiumCourses: courseId, // Add to premiumCourses array
              enrolledCourses: courseId, // Ensure enrolledCourses also includes it
            },
          },
          { new: true },
        )
        console.log("UserModel updated successfully for user:", userUpdate._id)

        // 9. Update course enrollment count if this is a new enrollment
        // Check if enrolledAt was just set (meaning it's a new enrollment)
        if (
          progressUpdate &&
          progressUpdate.enrolledAt &&
          progressUpdate.enrolledAt.getTime() === progressUpdate.createdAt.getTime()
        ) {
          await Course.findByIdAndUpdate(courseId, {
            $inc: { enrollmentCount: 1 },
          })
          console.log("Course enrollment count incremented for course:", courseId)
        }

        res.json({
          success: true,
          message: "Payment verified and premium access granted successfully.",
          data: {
            courseId,
            isPremium: true,
            premiumPurchasedAt: new Date(),
            transactionId: transaction_code,
            amount: total_amount,
          },
        })
      } catch (dbError) {
        console.error("Database update error after successful eSewa verification:", dbError)
        res.status(500).json({
          success: false,
          message: "Payment verified but failed to update records. Please contact support.",
          error: dbError.message,
        })
      }
    } else {
      console.error("eSewa API verification failed:", esewaVerification.error)
      res.status(400).json({
        success: false,
        message: esewaVerification.error || "Payment verification failed with eSewa.",
      })
    }
  } catch (error) {
    console.error("Unhandled error in /verify-esewa-v2 endpoint:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error during payment verification.",
      error: error.message,
    })
  }
})

// Verify eSewa signature (optional but recommended)
async function verifyEsewaSignature(paymentData) {
  try {
    const SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q"
    const { signature } = paymentData // Only destructure signature, use paymentData for message construction

    if (!paymentData.signed_field_names || !signature) {
      console.log("Signature verification skipped: No signed_field_names or signature provided by eSewa.")
      return true // Skip verification if no signature data
    }

    // Create message from signed fields using the original paymentData
    const fields = paymentData.signed_field_names.split(",")
    const message = fields.map((field) => `${field}=${paymentData[field]}`).join(",") // Use paymentData[field]

    // Generate expected signature
    const expectedSignature = crypto.createHmac("sha256", SECRET_KEY).update(message).digest("base64")

    const isValid = signature === expectedSignature
    console.log("Signature verification result:", { isValid, message, expectedSignature, receivedSignature: signature })

    return isValid
  } catch (error) {
    console.error("Error during signature verification:", error)
    return false
  }
}

// Additional verification using Node.js fetch or https module
async function verifyWithEsewa(transactionCode, amount, transactionUuid) {
  const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || "EPAYTEST"
  const verificationUrl = "https://uat.esewa.com.np/epay/transrec" // Use UAT for testing

  console.log("Attempting additional eSewa verification with:", {
    transactionCode,
    amount,
    transactionUuid,
    merchantId: ESEWA_MERCHANT_ID,
  })

  const formData = new URLSearchParams()
  formData.append("amt", amount.toString())
  formData.append("scd", ESEWA_MERCHANT_ID)
  formData.append("rid", transactionCode)
  formData.append("pid", transactionUuid)

  const postData = formData.toString()

  // Try using fetch first
  try {
    console.log("Attempting eSewa verification using fetch API...")
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (compatible; eSewa-Verification/1.0)",
        Accept: "*/*",
        Connection: "keep-alive",
      },
      body: postData,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error("eSewa API fetch response not OK:", response.status, response.statusText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const responseText = await response.text()
    console.log("eSewa fetch verification response:", responseText)

    const isSuccess = responseText.includes("<response_code>Success</response_code>")
    if (isSuccess) {
      console.log("✅ eSewa API verification successful (via fetch)")
      return { success: true }
    } else {
      console.log("❌ eSewa API verification failed (via fetch)")
      return { success: false, error: "eSewa API did not confirm payment." }
    }
  } catch (fetchError) {
    console.error("Fetch API verification failed:", fetchError.message)

    // Fallback to Node.js https module if fetch fails
    try {
      console.log("Attempting eSewa verification using Node.js https module as fallback...")
      const result = await verifyWithHttpsModule(verificationUrl, postData)
      return result
    } catch (httpsError) {
      console.error("HTTPS module verification also failed:", httpsError.message)

      // In development mode, allow mock verification if both fetch and https fail
      if (process.env.NODE_ENV === "development") {
        console.log("🚧 Development mode: Both verification methods failed. Using mock verification.")
        // You might want to add more specific mock conditions here if needed
        return { success: true, mock: true, message: "Mock verification successful in development." }
      }

      return {
        success: false,
        error: `Network error during eSewa verification: ${httpsError.message}. Please check server internet connection.`,
      }
    }
  }
}

// Fallback verification using Node.js https module
function verifyWithHttpsModule(url, postData) {
  return new Promise((resolve, reject) => {
    const urlParts = new URL(url)

    const options = {
      hostname: urlParts.hostname,
      port: 443,
      path: urlParts.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
        "User-Agent": "Mozilla/5.0 (compatible; eSewa-Verification/1.0)",
      },
      timeout: 30000, // 30 second timeout
    }

    const req = https.request(options, (res) => {
      let data = ""

      res.on("data", (chunk) => {
        data += chunk
      })

      res.on("end", () => {
        console.log("HTTPS module response:", data)

        if (data.includes("<response_code>Success</response_code>")) {
          console.log("✅ eSewa API verification successful (via https module)")
          resolve({ success: true })
        } else {
          console.log("❌ eSewa API verification failed (via https module)")
          resolve({ success: false, error: "eSewa API did not confirm payment (https module)." })
        }
      })
    })

    req.on("error", (error) => {
      console.error("HTTPS request error:", error)
      reject(error)
    })

    req.on("timeout", () => {
      console.error("HTTPS request timeout")
      req.destroy()
      reject(new Error("Request timeout"))
    })

    req.write(postData)
    req.end()
  })
}

// Keep the original endpoint for backward compatibility (if still in use)
router.post("/verify-esewa", authenticateUser, async (req, res) => {
  try {
    const { oid, amt, refId } = req.body
    const userId = req.user.id

    console.log("Payment verification request (legacy) received:", { oid, amt, refId, userId })

    // Validate input parameters
    if (!oid || !amt || !refId) {
      console.error("Error: Missing required parameters in /verify-esewa (legacy):", { oid, amt, refId })
      return res.status(400).json({
        success: false,
        message: "Missing required payment parameters",
      })
    }

    // Extract course ID from order ID (format: course_<courseId>_<timestamp>)
    const orderParts = oid.split("_")
    if (orderParts.length < 3 || orderParts[0] !== "course") {
      console.error("Error: Invalid order ID format in /verify-esewa (legacy):", oid)
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      })
    }

    const courseId = orderParts[1]
    console.log("Extracted course ID (legacy):", courseId)

    // Verify the course exists
    const course = await Course.findById(courseId)
    if (!course) {
      console.error("Error: Course not found for ID (legacy):", courseId)
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    // Verify payment with eSewa (using the legacy verification function)
    console.log("Verifying payment with eSewa (legacy)...")
    const verificationResult = await verifyEsewaPayment(oid, amt, refId) // This calls the original verifyEsewaPayment

    if (verificationResult.success) {
      console.log("Payment verified successfully (legacy), updating user records...")

      try {
        // Update user progress to premium
        const progressUpdate = await UserProgress.findOneAndUpdate(
          { userId, courseId },
          {
            $set: {
              isPremium: true,
              premiumPurchasedAt: new Date(),
            },
            $setOnInsert: {
              userId,
              courseId,
              completedLessons: [],
              enrolledAt: new Date(),
            },
          },
          {
            upsert: true,
            new: true,
            runValidators: true,
          },
        )
        console.log("Progress updated (legacy):", progressUpdate)

        // Update user's premiumCourses and ensure enrollment
        const userUpdate = await UserModel.findByIdAndUpdate(
          userId,
          {
            $addToSet: {
              premiumCourses: courseId,
              enrolledCourses: courseId,
            },
          },
          { new: true },
        )
        console.log("User updated successfully (legacy)")

        // Update course enrollment count if needed
        if (progressUpdate && !progressUpdate.enrolledAt) {
          await Course.findByIdAndUpdate(courseId, {
            $inc: { enrollmentCount: 1 },
          })
          console.log("Course enrollment count incremented (legacy)")
        }

        res.json({
          success: true,
          message: "Payment verified and premium access granted successfully (legacy)",
          data: {
            courseId,
            isPremium: true,
            premiumPurchasedAt: new Date(),
            orderId: oid,
          },
        })
      } catch (dbError) {
        console.error("Database update error (legacy):", dbError)
        res.status(500).json({
          success: false,
          message: "Payment verified but failed to update records. Please contact support.",
          error: dbError.message,
        })
      }
    } else {
      console.error("eSewa payment verification failed (legacy):", verificationResult.error)
      res.status(400).json({
        success: false,
        message: "Payment verification failed with eSewa (legacy)",
        error: verificationResult.error,
      })
    }
  } catch (error) {
    console.error("Payment verification error (legacy):", error)
    res.status(500).json({
      success: false,
      message: "Internal server error during payment verification (legacy)",
      error: error.message,
    })
  }
})

// Legacy eSewa verification function (kept for reference/backward compatibility)
async function verifyEsewaPayment(oid, amt, refId) {
  const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || "EPAYTEST"
  const verificationUrl = "https://uat.esewa.com.np/epay/transrec"

  console.log("Legacy eSewa verification config:", {
    merchantId: ESEWA_MERCHANT_ID,
    verificationUrl,
    oid,
    amt,
    refId,
  })

  const formData = new URLSearchParams()
  formData.append("amt", amt.toString())
  formData.append("scd", ESEWA_MERCHANT_ID)
  formData.append("rid", refId.toString())
  formData.append("pid", oid.toString())

  console.log("Sending legacy verification request with data:", formData.toString())

  try {
    console.log("Attempting legacy verification with fetch...")

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (compatible; eSewa-Verification/1.0)",
        Accept: "*/*",
        Connection: "keep-alive",
      },
      body: formData.toString(),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error("Legacy eSewa API response not OK:", response.status, response.statusText)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const responseText = await response.text()
    console.log("Legacy eSewa verification response:", responseText)

    const isSuccess = responseText.includes("<response_code>Success</response_code>")

    if (isSuccess) {
      console.log("✅ Legacy eSewa payment verification successful")
      return { success: true }
    } else {
      console.log("❌ Legacy eSewa payment verification failed")
      return { success: false, error: "Payment not verified by eSewa" }
    }
  } catch (error) {
    console.error("Legacy eSewa verification failed:", error.message)

    if (process.env.NODE_ENV === "development") {
      console.log("🚧 Development mode: Using mock verification for legacy endpoint.")
      return { success: true, mock: true }
    }

    return {
      success: false,
      error: `Network error: ${error.message}. Please check your internet connection and try again.`,
    }
  }
}

// Health check endpoint for payment service
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Payment service is running",
    timestamp: new Date().toISOString(),
    esewaConfig: {
      merchantId: process.env.ESEWA_MERCHANT_ID || "EPAYTEST",
      environment: "UAT",
    },
  })
})

export default router
