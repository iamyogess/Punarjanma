// routes/payment.js - Fixed eSewa Verification with Better Error Handling
import express from "express";
import https from "https";
import { URLSearchParams } from "url";
import Course from "../models/course-model.js";
import { authenticateUser } from "../middleware/auth-middleware.js";
import UserModel from "./../models/user-model.js";
import UserProgress from "./../models/user-process-model.js";

const router = express.Router();

// Verify eSewa payment
router.post("/verify-esewa", authenticateUser, async (req, res) => {
  try {
    const { oid, amt, refId } = req.body;
    const userId = req.user.id;
    
    console.log("Payment verification request:", { oid, amt, refId, userId });

    // Validate input parameters
    if (!oid || !amt || !refId) {
      console.error("Missing required parameters:", { oid, amt, refId });
      return res.status(400).json({
        success: false,
        message: "Missing required payment parameters",
      });
    }

    // Extract course ID from order ID (format: course_<courseId>_<timestamp>)
    const orderParts = oid.split("_");
    if (orderParts.length < 3 || orderParts[0] !== "course") {
      console.error("Invalid order ID format:", oid);
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }
    
    const courseId = orderParts[1];
    console.log("Extracted course ID:", courseId);

    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      console.error("Course not found:", courseId);
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Verify payment with eSewa
    console.log("Verifying payment with eSewa...");
    const verificationResult = await verifyEsewaPayment(oid, amt, refId);

    if (verificationResult.success) {
      console.log("Payment verified successfully, updating user records...");
      
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
            }
          },
          { 
            upsert: true, 
            new: true,
            runValidators: true 
          }
        );

        console.log("Progress updated:", progressUpdate);

        // Update user's premiumCourses and ensure enrollment
        const userUpdate = await UserModel.findByIdAndUpdate(
          userId,
          {
            $addToSet: {
              premiumCourses: courseId,
              enrolledCourses: courseId,
            },
          },
          { new: true }
        );

        console.log("User updated successfully");

        // Update course enrollment count if needed
        if (progressUpdate && !progressUpdate.enrolledAt) {
          await Course.findByIdAndUpdate(courseId, {
            $inc: { enrollmentCount: 1 },
          });
          console.log("Course enrollment count incremented");
        }

        res.json({
          success: true,
          message: "Payment verified and premium access granted successfully",
          data: {
            courseId,
            isPremium: true,
            premiumPurchasedAt: new Date(),
            orderId: oid,
          },
        });

      } catch (dbError) {
        console.error("Database update error:", dbError);
        res.status(500).json({
          success: false,
          message: "Payment verified but failed to update records. Please contact support.",
          error: dbError.message,
        });
      }

    } else {
      console.error("eSewa payment verification failed:", verificationResult.error);
      res.status(400).json({
        success: false,
        message: "Payment verification failed with eSewa",
        error: verificationResult.error,
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during payment verification",
      error: error.message,
    });
  }
});

// Improved eSewa verification function with multiple approaches
async function verifyEsewaPayment(oid, amt, refId) {
  const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || "EPAYTEST";
  const verificationUrl = "https://uat.esewa.com.np/epay/transrec";

  console.log("eSewa verification config:", {
    merchantId: ESEWA_MERCHANT_ID,
    verificationUrl,
    oid,
    amt,
    refId
  });

  // Prepare form data for eSewa verification
  const formData = new URLSearchParams();
  formData.append("amt", amt.toString());
  formData.append("scd", ESEWA_MERCHANT_ID);
  formData.append("rid", refId.toString());
  formData.append("pid", oid.toString());

  console.log("Sending verification request with data:", formData.toString());

  // Try multiple verification approaches
  
  // Approach 1: Using fetch with better error handling
  try {
    console.log("Attempting verification with fetch...");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (compatible; eSewa-Verification/1.0)",
        "Accept": "*/*",
        "Connection": "keep-alive",
      },
      body: formData.toString(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error("eSewa API response not OK:", response.status, response.statusText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    console.log("eSewa verification response:", responseText);

    const isSuccess = responseText.includes("<response_code>Success</response_code>");
    
    if (isSuccess) {
      console.log("✅ eSewa payment verification successful (fetch)");
      return { success: true };
    } else {
      console.log("❌ eSewa payment verification failed (fetch)");
      return { success: false, error: "Payment not verified by eSewa" };
    }

  } catch (fetchError) {
    console.error("Fetch verification failed:", fetchError.message);
    
    // Approach 2: Using Node.js https module as fallback
    try {
      console.log("Attempting verification with https module...");
      
      const result = await verifyWithHttpsModule(verificationUrl, formData.toString());
      return result;
      
    } catch (httpsError) {
      console.error("HTTPS module verification failed:", httpsError.message);
      
      // Approach 3: Mock verification for development (if in development mode)
      if (process.env.NODE_ENV === 'development') {
        console.log("🚧 Development mode: Using mock verification");
        
        // In development, we can mock the verification for testing
        // Remove this in production!
        if (oid.includes("test") || amt === "100") {
          return { success: true, mock: true };
        }
      }
      
      return { 
        success: false, 
        error: `Network error: ${fetchError.message}. Please check your internet connection and try again.` 
      };
    }
  }
}

// Fallback verification using Node.js https module
function verifyWithHttpsModule(url, postData) {
  return new Promise((resolve, reject) => {
    const urlParts = new URL(url);
    
    const options = {
      hostname: urlParts.hostname,
      port: 443,
      path: urlParts.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (compatible; eSewa-Verification/1.0)',
      },
      timeout: 30000, // 30 second timeout
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log("HTTPS module response:", data);
        
        if (data.includes("<response_code>Success</response_code>")) {
          console.log("✅ eSewa payment verification successful (https)");
          resolve({ success: true });
        } else {
          console.log("❌ eSewa payment verification failed (https)");
          resolve({ success: false, error: "Payment not verified by eSewa" });
        }
      });
    });

    req.on('error', (error) => {
      console.error("HTTPS request error:", error);
      reject(error);
    });

    req.on('timeout', () => {
      console.error("HTTPS request timeout");
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Health check endpoint for payment service
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Payment service is running",
    timestamp: new Date().toISOString(),
    esewaConfig: {
      merchantId: process.env.ESEWA_MERCHANT_ID || "EPAYTEST",
      environment: "UAT"
    }
  });
});

// Test endpoint to check eSewa connectivity
router.get("/test-esewa-connection", async (req, res) => {
  try {
    console.log("Testing eSewa connectivity...");
    
    // Test with dummy data
    const testResult = await verifyEsewaPayment("test_123_456", "100", "dummy_ref");
    
    res.json({
      success: true,
      message: "eSewa connectivity test completed",
      result: testResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "eSewa connectivity test failed",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;