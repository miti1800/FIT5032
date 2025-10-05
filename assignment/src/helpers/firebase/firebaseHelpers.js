export function getFirebaseErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please use log in.';
    case 'auth/invalid-credential':
      return 'The email or password you entered is incorrect. Please try again.';
    case 'auth/user-not-found':
      return 'No user found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}