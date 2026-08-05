#!/usr/bin/env bash
# Construye el APK de Android usando el tooling self-contained del proyecto
# (SDK en .android-sdk, JDK en .jdk y caché de Gradle en .gradle).
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export GRADLE_USER_HOME="$PROJECT_DIR/.gradle"

cd "$PROJECT_DIR/android"
./gradlew assembleDebug "$@"

echo ""
echo "APK listo: $PROJECT_DIR/android/app/build/outputs/apk/debug/app-debug.apk"
