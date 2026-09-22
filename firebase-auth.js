import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDP8BkZ5P6FqpWXSCbXhD4onNm56Wfeqaw",
  authDomain: "styledock-ed066.firebaseapp.com",
  projectId: "styledock-ed066",
  storageBucket: "styledock-ed066.firebasestorage.app",
  messagingSenderId: "176963333319",
  appId: "1:176963333319:web:5a7746056a3adcff73e2e2",
  measurementId: "G-KGTRT4BPP3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let confirmationResult = null;
let recaptchaVerifier = null;
let resendTimer = null;

function setupRecaptcha() {
  if (recaptchaVerifier) return recaptchaVerifier;

  recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
    callback: () => {
      console.log("reCAPTCHA verified");
    },
    "expired-callback": () => {
      recaptchaVerifier = null;
    }
  });

  return recaptchaVerifier;
}

async function sendOTP(phoneNumber) {
  try {
    const verifier = setupRecaptcha();

    confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      verifier
    );

    console.log("OTP sent successfully");

    startResendTimer(30);

    return {
      success: true,
      message: "OTP sent successfully."
    };

  } catch (error) {
    console.error("OTP error:", error);

    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (_) {}

      recaptchaVerifier = null;
    }

    let message = "OTP send nahi ho paya. Please try again.";

    switch (error.code) {
      case "auth/invalid-phone-number":
        message = "Mobile number galat hai.";
        break;

      case "auth/too-many-requests":
        message = "Too many attempts. Please try again later.";
        break;

      case "auth/quota-exceeded":
        message = "SMS limit reached. Please try again later.";
        break;

      case "auth/network-request-failed":
        message = "Internet connection check karke dobara try karein.";
        break;
    }

    return {
      success: false,
      message
    };
  }
}

async function verifyOTP(code, name = "") {
  if (!confirmationResult) {
    return {
      success: false,
      message: "Please request OTP first."
    };
  }

  try {
    const result = await confirmationResult.confirm(code);

    if (name.trim()) {
      await updateProfile(result.user, {
        displayName: name.trim()
      });
    }

    confirmationResult = null;

    return {
      success: true,
      user: result.user
    };

  } catch (error) {
    console.error("OTP verification error:", error);

    let message = "Invalid OTP.";

    switch (error.code) {
      case "auth/invalid-verification-code":
        message = "OTP galat hai.";
        break;

      case "auth/code-expired":
        message = "OTP expire ho gaya. New OTP request karein.";
        break;

      case "auth/too-many-requests":
        message = "Too many attempts. Please try again later.";
        break;
    }

    return {
      success: false,
      message
    };
  }
}

function startResendTimer(seconds) {
  clearInterval(resendTimer);

  let remaining = seconds;

  window.dispatchEvent(
    new CustomEvent("tsd-auth-timer", {
      detail: { remaining }
    })
  );

  resendTimer = setInterval(() => {
    remaining--;

    window.dispatchEvent(
      new CustomEvent("tsd-auth-timer", {
        detail: { remaining }
      })
    );

    if (remaining <= 0) {
      clearInterval(resendTimer);
    }
  }, 1000);
}

onAuthStateChanged(auth, (user) => {
  window.dispatchEvent(
    new CustomEvent("tsd-auth-state", {
      detail: { user }
    })
  );
});

window.TSDAuth = {
  sendOTP,
  verifyOTP,

  logout: async () => {
    await signOut(auth);
  },

  getUser: () => auth.currentUser
};
