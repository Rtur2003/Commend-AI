# 🚨 SECURITY CLEANUP INSTRUCTIONS

## Critical Security Issue Detected
API keys were accidentally committed to the repository. Follow these steps IMMEDIATELY:

## 1. IMMEDIATE ACTIONS (DO NOW!)

### Revoke Compromised API Keys
1. Go to: https://console.cloud.google.com/apis/credentials
2. Delete these compromised keys:
   - `AIzaSyBZJudQhW7fkj_dX6lpCazvgEGrD5kYT48`
   - `AIzaSyDHpOyZX0EJx4ueRLR7CP0Q68n_rp15cwc`
3. Generate new API keys
4. Update your local .env files with new keys

### Update .env Files Locally
```bash
# In backend/.env (create if doesn't exist)
GEMINI_API_KEY=your_new_gemini_key_here
YOUTUBE_API_KEY=your_new_youtube_key_here
SECRET_KEY=your_secret_key_here
ADMIN_PASSWORD=your_admin_password_here
```

## 2. GIT HISTORY CLEANUP (Advanced Users)

### Option A: BFG Repo-Cleaner (Recommended)
```bash
# Download BFG from: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files "*.env" --no-blob-protection
java -jar bfg.jar --replace-text patterns.txt --no-blob-protection
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

### Option B: Git Filter-Branch
```bash
# Remove sensitive files from all commits
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch backend/.env' \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history)
git push --force --all
```

### Option C: Create Fresh Repository (Safest)
1. Create a new repository on GitHub
2. Copy current code (without .git folder)
3. Initialize fresh git repo
4. Commit clean code
5. Update repository links

## 3. PREVENTION MEASURES

### Enhanced .gitignore
Ensure these lines are in .gitignore:
```
# Environment variables
.env
.env.local
.env.production
.env.development
**/.env
**/env
```

### Pre-commit Hooks
Install git-secrets:
```bash
# Install git-secrets
git secrets --install
git secrets --register-aws
git secrets --add 'AIza[0-9A-Za-z_-]{35}'
```

## 4. MONITORING

### GitHub Security Alerts
- Enable security alerts in repository settings
- Set up notifications for secret scanning
- Regularly review security advisories

### Regular Audits
- Use tools like GitLeaks or TruffleHog
- Scan for secrets before commits
- Implement CI/CD security checks

## Status: ⚠️ URGENT - Complete steps 1-2 immediately!