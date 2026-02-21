# GitHub 업로드 방법 (https://github.com/m3n89t-max/autotrade)

아래 명령을 **프로젝트 폴더(autotrade)** 에서 **한 줄씩** 실행하세요.

## 1. Git 초기화 및 첫 커밋

```bash
git init
git add .
git commit -m "Initial commit: AUTOTRADE NEoWave UI + FastAPI backend"
```

## 2. 원격 저장소 연결 및 푸시

```bash
git remote add origin https://github.com/m3n89t-max/autotrade.git
git branch -M main
git push -u origin main
```

- **푸시 시** GitHub 로그인(또는 토큰)을 요구하면 브라우저/터미널에서 인증하세요.
- 이미 `git init`이나 `origin`이 있다면 `git remote add` 대신 다음만 실행:
  ```bash
  git remote set-url origin https://github.com/m3n89t-max/autotrade.git
  git push -u origin main
  ```

## 주의

- `.env`(API 키)는 `.gitignore`에 있어 **업로드되지 않습니다.**
- 새로 올릴 때마다: `git add .` → `git commit -m "메시지"` → `git push`
