# AUTOTRADE 백엔드

## Python 3.14 사용 시 오류 나는 경우

지금처럼 **Python 3.12가 없고 3.14만 있으면** `pydantic-core` 빌드가 실패합니다. **Python 3.12를 한 번 설치**하면 해결됩니다.

---

## 1) Python 3.12 설치 (한 번만 하면 됨)

**방법 A – winget (명령 한 줄)**  
PowerShell에서:

```powershell
winget install Python.Python.3.12 --accept-package-agreements
```

설치가 끝나면 **터미널을 완전히 닫았다가 다시 열기**.

**방법 B – 수동 설치**  
1. https://www.python.org/downloads/release/python-3120/  
2. 맨 아래 **Windows installer (64-bit)** 다운로드 후 실행  
3. **"Add Python to PATH"** 반드시 체크 후 설치  
4. 설치 후 **터미널 다시 열기**

---

## 2) 터미널에서 서버 실행

**backend 폴더로 이동**
```powershell
cd C:\Users\문인성\Desktop\autotrade\backend
```

**의존성 설치 (최초 1회)**

- **방법 A – 서버/차트만 (권장, Build Tools 불필요)**  
  `chroma-hnswlib` 빌드 오류 없이 바로 실행하려면:
```powershell
py -3.12 -m pip install -r requirements-core.txt
```

- **방법 B – RAG/OCR 포함 (전체)**  
  이때는 **Microsoft C++ Build Tools**가 필요합니다.  
  [다운로드](https://visualstudio.microsoft.com/visual-cpp-build-tools/) → "C++를 사용한 데스크톱 개발" 설치 후:
```powershell
py -3.12 -m pip install -r requirements.txt
```

**서버 실행**
```powershell
py -3.12 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

이후 브라우저에서 **http://localhost:8000/docs** 로 API 문서 확인.

---

## 요약

| 상황 | 할 일 |
|------|--------|
| `No runtime installed that matches 3.12` | 위 **1) Python 3.12 설치** 후 터미널 다시 열기 |
| `pydantic-core` / `metadata-generation-failed` | Python 3.14 때문 → **3.12 설치** 후 `py -3.12` 로 실행 |
| `chroma-hnswlib` / `Microsoft Visual C++ 14.0 required` | **`requirements-core.txt`** 로 설치하거나, [C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) 설치 후 `requirements.txt` 사용 |

## run.bat

- Python 3.12가 설치되어 있으면 `run.bat`에서 자동으로 3.12를 사용합니다.
