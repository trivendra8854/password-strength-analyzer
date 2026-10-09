# Password Strength Analyzer

A responsive, beginner-friendly password strength analyzer built with HTML, CSS, and vanilla JavaScript.

## Live demo
https://trivendra8854.github.io/password-strength-analyzer/

## Features
- Checks password length, lowercase/uppercase letters, numbers, and symbols.
- Flags a small set of common passwords, obvious sequences, and repeated characters.
- Gives a strength label, a simple score, and actionable suggestions.
- Includes show/hide password and a secure random password generator using the browser's `crypto.getRandomValues`.
- Runs entirely in the browser. Password input is not transmitted or saved.

## Run locally
1. Extract the ZIP.
2. Open `index.html` in Chrome, Edge, Firefox, or Safari.
3. Type a made-up test password and observe the live checklist.

You can also open the folder in VS Code and use the Live Server extension.

## Publish and submit
1. Create a new public GitHub repository.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md`.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/(root)`, then save.
5. Wait for GitHub Pages to publish the site. Copy the live `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/` URL into the task's Submission Link field. You can submit the repository URL if a live site is not required.

## Security note
This is a learning project with a deliberately simple rule-based score, not a professional password-cracking estimator. Never enter real account passwords into demo tools. The app does not store or send password input.
