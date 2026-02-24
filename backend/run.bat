@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo [1/3] Python 확인 중...
REM Python 3.12가 있으면 우선 사용 (pydantic 등 호환 좋음)
py -3.12 -c "exit(0)" >nul 2>&1
if %errorlevel% equ 0 (
    set PY=py -3.12
    echo Python 3.12 사용.
    goto :install
)
where py >nul 2>&1
if %errorlevel% equ 0 (
    set PY=py
    goto :install
)
where python >nul 2>&1
if %errorlevel% equ 0 (
    set PY=python
    goto :install
)
echo 오류: Python이 없거나 PATH에 없습니다.
echo https://www.python.org/downloads/ 에서 Python 3.12 설치 후 "Add Python to PATH" 체크하세요.
pause
exit /b 1

:install
echo [2/3] 의존성 설치 (%PY%)...
%PY% -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo.
    echo pip 설치 실패. Python 3.12 사용을 권장합니다.
    echo https://www.python.org/downloads/release/python-3120/
    pause
    exit /b 1
)
echo [3/3] 서버 실행...
%PY% -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

echo.
echo 서버가 종료되었습니다.
pause
