# 🔐 Security Policy

## 🛡️ Supported Versions

We actively maintain and provide security updates for the following versions of Desk+:

| Version | Supported          |
|---------|--------------------|
| 1.x     | ✅ Yes              |
| < 1.0   | ❌ No               |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, **do not open a public issue**.

Instead, report it responsibly:

- 📧 Email: security@deskplus.local *(replace with your real email)*
- 📝 Include:
  - Description of the vulnerability
  - Steps to reproduce
  - Possible impact
  - Screenshots or proof of concept (if applicable)

### ⏱ Response Time
We aim to:
- Acknowledge within **48 hours**
- Provide a fix or mitigation within **7 days**, depending on severity

---

## 🔒 Security Best Practices

### Backend (Laravel)
- Uses **Laravel 11** with built-in security features
- Authentication handled via **Sanctum**
- CSRF protection enabled by default
- Input validation enforced on all endpoints
- Passwords are hashed using strong algorithms (bcrypt/argon2)

### Frontend (React + Vite)
- Avoid storing sensitive data in localStorage
- Use HTTPS in production
- Validate user input before sending to API

### General
- Keep dependencies up to date (`composer update`, `npm audit`)
- Use environment variables for sensitive credentials
- Restrict access to admin routes via roles/permissions
- Never expose `.env` files

---

## 🔑 Default Credentials Warning

The following credentials are provided **for development only**:

- Admin: `admin@deskplus.local / password123`
- Seller: `seller@deskplus.local / password123`

⚠️ **Change these immediately in production.**

---

# 📜 Usage Policy

## ✅ Allowed Use

You are allowed to:
- Use this project for learning, development, and commercial purposes
- Modify and distribute the code
- Build SaaS or internal tools using this repository

---

## ❌ Prohibited Use

You may NOT:
- Use this project for illegal activities
- Attempt to exploit or harm users of this system
- Deploy insecure versions knowingly exposing users to risk
- Misuse authentication or authorization mechanisms

---

## ⚖️ Responsibility

By using this project, you agree that:

- You are responsible for securing your deployment
- The maintainers are **not liable** for misuse or damages
- You must comply with applicable data protection laws (e.g., GDPR)

---

## 🔐 Data Protection

If handling user data:

- Encrypt sensitive data where possible
- Do not log passwords or private tokens
- Implement proper access control
- Provide users with data deletion options if required

---

## 📦 Dependencies

Keep your stack secure:

### Backend
```bash
composer audit
