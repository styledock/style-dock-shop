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
// ================================
// STYLE DOCK AUTH UI CONNECTION
// ================================

document.addEventListener("DOMContentLoaded", () => {
  const authBtn = document.getElementById("authBtn");
  const authModal = document.getElementById("authModal");
  const closeAuth = document.getElementById("closeAuth");

  const authPhoneStep = document.getElementById("authPhoneStep");
  const authOtpStep = document.getElementById("authOtpStep");

  const authPhone = document.getElementById("authPhone");
  const authName = document.getElementById("authName");
  const authOtp = document.getElementById("authOtp");

  const sendOtpBtn = document.getElementById("sendOtpBtn");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");
  const resendOtpBtn = document.getElementById("resendOtpBtn");

  const authMessage = document.getElementById("authMessage");

  if (!authBtn || !authModal) {
    console.error("STYLE DOCK Auth UI not found.");
    return;
  }

  function showMessage(message) {
    if (authMessage) {
      authMessage.textContent = message;
    }
  }

  function openAuth() {
    authModal.hidden = false;
    showMessage("");

    if (authPhoneStep) authPhoneStep.hidden = false;
    if (authOtpStep) authOtpStep.hidden = true;

    if (authPhone) {
      setTimeout(() => authPhone.focus(), 100);
    }
  }

  function closeAuthModal() {
    authModal.hidden = true;
    showMessage("");
  }

  authBtn.addEventListener("click", () => {
    openAuth();
  });

  if (closeAuth) {
    closeAuth.addEventListener("click", closeAuthModal);
  }

  authModal.addEventListener("click", (event) => {
    if (event.target === authModal) {
      closeAuthModal();
    }
  });

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener("click", async () => {

      const rawPhone = authPhone.value.trim();

      if (!/^[6-9]\d{9}$/.test(rawPhone)) {
        showMessage("Please enter a valid 10-digit mobile number.");
        authPhone.focus();
        return;
      }

      const phoneNumber = "+91" + rawPhone;

      sendOtpBtn.disabled = true;
      sendOtpBtn.textContent = "Sending OTP...";
      showMessage("");

      const result = await window.TSDAuth.sendOTP(phoneNumber);

      if (result.success) {
        authPhoneStep.hidden = true;
        authOtpStep.hidden = false;

        showMessage("OTP sent successfully.");
        authOtp.focus();

      } else {
        showMessage(result.message);
        sendOtpBtn.disabled = false;
      }

      sendOtpBtn.textContent = "Send OTP";
    });
  }

  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener("click", async () => {

      const code = authOtp.value.trim();
      const name = authName.value.trim();

      if (!/^\d{6}$/.test(code)) {
        showMessage("Please enter the 6-digit OTP.");
        authOtp.focus();
        return;
      }

      verifyOtpBtn.disabled = true;
      verifyOtpBtn.textContent = "Verifying...";
      showMessage("");

      const result = await window.TSDAuth.verifyOTP(code, name);

      if (result.success) {
        showMessage("Login successful.");

        setTimeout(() => {
          closeAuthModal();
        }, 700);

      } else {
        showMessage(result.message);
      }

      verifyOtpBtn.disabled = false;
      verifyOtpBtn.textContent = "Verify OTP";
    });
  }

  if (resendOtpBtn) {
    resendOtpBtn.addEventListener("click", async () => {

      const rawPhone = authPhone.value.trim();

      if (!/^[6-9]\d{9}$/.test(rawPhone)) {
        showMessage("Please enter your mobile number again.");
        return;
      }

      resendOtpBtn.disabled = true;
      showMessage("Sending new OTP...");

      const result = await window.TSDAuth.sendOTP("+91" + rawPhone);

      if (result.success) {
        showMessage("New OTP sent.");
      } else {
        showMessage(result.message);
      }
    });
  }

  window.addEventListener("tsd-auth-timer", (event) => {
    const remaining = event.detail.remaining;

    if (!resendOtpBtn) return;

    if (remaining > 0) {
      resendOtpBtn.disabled = true;
      resendOtpBtn.textContent = `Resend OTP (${remaining}s)`;
    } else {
      resendOtpBtn.disabled = false;
      resendOtpBtn.textContent = "Resend OTP";
    }
  });

  window.addEventListener("tsd-auth-state", (event) => {
    const user = event.detail.user;

    if (!user) {
      authBtn.textContent = "Sign In";
      return;
    }

    authBtn.textContent = user.displayName
      ? user.displayName
      : "Account";
  });
});
