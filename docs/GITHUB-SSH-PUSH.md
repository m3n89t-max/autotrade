# GitHub SSH 푸시 (한글 사용자명 환경)

한글 사용자 폴더(`C:\Users\문인성`) 때문에 Git/SSH가 `.ssh` 경로를 제대로 못 찾을 때 아래 방법을 사용하세요.

## 1. 영문 경로에 .ssh 만들기

PowerShell **관리자 권한**으로 실행 후:

```powershell
# 영문만 있는 경로에 .ssh 폴더 생성
$env:GIT_SSH_HOME = "C:\git_ssh"
New-Item -ItemType Directory -Force -Path "C:\git_ssh\.ssh"
```

## 2. GitHub 호스트 등록 (known_hosts)

```powershell
ssh-keyscan github.com >> C:\git_ssh\.ssh\known_hosts 2>$null
```

## 3. SSH 키 생성 (아직 없다면)

```powershell
ssh-keygen -t ed25519 -C "m3n89t-max@github" -f "C:\git_ssh\.ssh\id_ed25519" -N '""'
```

## 4. 공개키를 GitHub에 등록

```powershell
Get-Content C:\git_ssh\.ssh\id_ed25519.pub
```

출력된 내용 **전체**를 복사한 뒤:

- GitHub → **Settings** → **SSH and GPG keys** → **New SSH key**
- Title: `내 PC` 등
- Key: 붙여넣기 → **Add SSH key**

## 5. 이 경로를 쓰고 푸시

**일반 PowerShell**에서 (프로젝트 폴더로 이동 후):

```powershell
cd "C:\Users\문인성\Desktop\autotrade"
$env:HOME = "C:\git_ssh"
git push origin main
```

매번 푸시할 때 `$env:HOME = "C:\git_ssh"` 를 먼저 실행하거나, 아래처럼 한 번만 설정해 둘 수 있습니다.

### (선택) 영구 설정

```powershell
[System.Environment]::SetEnvironmentVariable("HOME", "C:\git_ssh", "User")
```

설정 후 **PowerShell을 다시 연 다음** `git push origin main` 실행.

---

## 그래도 안 되면: HTTPS + 토큰

SSH 대신 Classic 토큰으로 푸시:

1. GitHub → Settings → Developer settings → Personal access tokens → **Tokens (classic)** → **repo** 체크 후 토큰 생성
2. PowerShell에서:

```powershell
cd "C:\Users\문인성\Desktop\autotrade"
git remote set-url origin https://github.com/m3n89t-max/autotrade.git
git push origin main
```

- 사용자명: `m3n89t-max`
- 비밀번호: **방금 만든 토큰 전체** 입력
