const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('toggle');
const strengthLabel = document.getElementById('strength-label');
const meterFill = document.getElementById('meter-fill');
const meter = document.getElementById('meter');
const summary = document.getElementById('summary');
const suggestions = document.getElementById('suggestions');
const generatedNote = document.getElementById('generated-note');

const commonPasswords = new Set([
  'password', 'password123', '123456', '123456789', 'qwerty', 'admin',
  'letmein', 'welcome', 'iloveyou', 'abc123', '111111', '000000'
]);

function analyzePassword(password) {
  const checks = {
    length: password.length >= 12,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
    unique: password.length > 0 &&
      !commonPasswords.has(password.toLowerCase()) &&
      !/(.)\1{3,}/.test(password) &&
      !/^(1234|abcd|qwerty)/i.test(password)
  };

  if (!password) return { checks, score: 0, label: 'Waiting for input' };

  let score = 0;
  if (password.length >= 8) score += 15;
  if (password.length >= 12) score += 20;
  if (password.length >= 16) score += 15;
  if (checks.lower) score += 10;
  if (checks.upper) score += 10;
  if (checks.number) score += 10;
  if (checks.symbol) score += 10;
  if (checks.unique) score += 10;
  if (/(password|qwerty|admin|welcome|letmein|123456)/i.test(password)) score -= 35;
  if (/(.)\1{3,}/.test(password)) score -= 15;
  if (/^(1234|abcd|qwerty)/i.test(password)) score -= 15;
  score = Math.max(0, Math.min(100, score));

  let label;
  if (password.length < 8 || commonPasswords.has(password.toLowerCase()) || score < 35) label = 'Weak';
  else if (score < 70) label = 'Fair';
  else if (score < 90) label = 'Good';
  else label = 'Strong';

  return { checks, score, label };
}

function updateUI() {
  const password = passwordInput.value;
  const result = analyzePassword(password);

  document.querySelectorAll('[data-check]').forEach(item => {
    const key = item.dataset.check;
    const passed = result.checks[key];
    item.classList.toggle('pass', passed);
    item.querySelector('.check-icon').textContent = passed ? '✓' : '○';
  });

  strengthLabel.textContent = result.label;
  meterFill.style.width = `${result.score}%`;
  meter.setAttribute('aria-valuenow', String(result.score));

  const colors = {
    'Waiting for input': '#c8d0df',
    'Weak': '#e34b5d',
    'Fair': '#f0a12b',
    'Good': '#2e83df',
    'Strong': '#0eaa78'
  };
  meterFill.style.background = colors[result.label];

  if (!password) {
    summary.textContent = 'Enter a test password to see its strength.';
    suggestions.textContent = 'Use a long, unique passphrase or a password manager to create a password.';
    return;
  }

  summary.textContent = `${result.label} password · ${password.length} character${password.length === 1 ? '' : 's'} · Score: ${result.score}/100. This score is a simple educational estimate.`;
  const tips = [];
  if (password.length < 12) tips.push('increase the length to at least 12–16 characters');
  if (!result.checks.lower) tips.push('add lowercase letters');
  if (!result.checks.upper) tips.push('add uppercase letters');
  if (!result.checks.number) tips.push('include a number');
  if (!result.checks.symbol) tips.push('include a symbol');
  if (!result.checks.unique) tips.push('avoid common words, sequences, and repeated characters');
  if (result.label === 'Strong' && tips.length === 0) {
    suggestions.textContent = 'Looks strong by these basic checks. Make sure it is unique to one account; a password manager can create and store a random password.';
  } else {
    suggestions.textContent = `To improve it, ${tips.length ? tips.join('; ') : 'use a longer, less predictable password'}. Avoid names, birthdays, keyboard patterns, and password reuse.`;
  }
}

function generatePassword() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*+-_=';
  const required = [
    'ABCDEFGHJKLMNPQRSTUVWXYZ',
    'abcdefghijkmnopqrstuvwxyz',
    '23456789',
    '!@#$%&*+-_='
  ];
  const randomIndex = max => {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] % max;
  };
  let chars = required.map(group => group[randomIndex(group.length)]);
  while (chars.length < 18) chars.push(alphabet[randomIndex(alphabet.length)]);
  // Fisher-Yates shuffle using browser cryptographic randomness.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  passwordInput.value = chars.join('');
  passwordInput.type = 'text';
  toggleButton.textContent = 'Hide';
  toggleButton.setAttribute('aria-label', 'Hide password');
  generatedNote.textContent = 'A random 18-character example was generated locally. Save it only in a trusted password manager.';
  updateUI();
}

passwordInput.addEventListener('input', () => {
  generatedNote.textContent = '';
  updateUI();
});

toggleButton.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  toggleButton.textContent = isHidden ? 'Hide' : 'Show';
  toggleButton.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
});

document.getElementById('generate').addEventListener('click', generatePassword);
document.getElementById('clear').addEventListener('click', () => {
  passwordInput.value = '';
  passwordInput.type = 'password';
  toggleButton.textContent = 'Show';
  toggleButton.setAttribute('aria-label', 'Show password');
  generatedNote.textContent = '';
  updateUI();
  passwordInput.focus();
});

updateUI();
