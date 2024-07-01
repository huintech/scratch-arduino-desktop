@echo off
if "%1"=="h" goto begin
start mshta vbscript:createobject("wscript.shell").run("""%~nx0"" h",0)(window.close)&&exit
:begin

@REM call "./CP210x/CP210xVCPInstaller_x86.exe"
@REM call "./Arduino/dpinst-x86.exe"
@REM
@REM call "./mbedWinSerial/mbedWinSerial_16466.exe"
@REM call "./FTDI USB Drivers/CDM21228_Setup.exe"
@REM call "./CH341SER/CH341SER.EXE"
call "./coconut-drivers.zip"
exit
