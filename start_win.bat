@echo off
set freePort=
set startPort=3000

:SEARCHPORT
netstat -o -n -a | find "LISTENING" | find ":%startPort% " > NUL
if "%ERRORLEVEL%" equ "0" (
  REM port unavailable
  set /a startPort +=1
  GOTO :SEARCHPORT
) ELSE (
  REM available
  set freePort=%startPort%
  GOTO :FOUNDPORT
)

:FOUNDPORT
set PORT=%freePort%
node server.js
cmd /k
