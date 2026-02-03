# 🚀 Guia Rápido de Compilação - Florandei

## Método Mais Fácil: Codemagic (Online, Grátis)

### Passo a Passo

1. **Fazer upload do código para GitHub**:
   ```bash
   # Se ainda não tem Git instalado, baixe em: https://git-scm.com/
   
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/SEU_USUARIO/florandei.git
   git push -u origin main
   ```

2. **Criar conta no Codemagic**:
   - Acesse: https://codemagic.io/signup
   - Faça login com GitHub

3. **Adicionar aplicação**:
   - Clique em "Add application"
   - Selecione o repositório "florandei"
   - Selecione "Flutter App"

4. **Configurar build**:
   - Project type: Flutter
   - Build for: Android
   - Build mode: Release
   - (Deixe outras opções padrão)

5. **Iniciar build**:
   - Clique em "Start new build"
   - Aguarde 10-15 minutos

6. **Baixar APK**:
   - Quando terminar, clique no ícone de download
   - Salve `app-release.apk`

### Instalar no Celular

1. Transfira o `app-release.apk` para seu Android
2. Abra o arquivo
3. Permita "Instalar de fontes desconhecidas"
4. Instale!

---

## Método Alternativo: Compilar Localmente

### Requisitos
- 10 GB de espaço livre
- 2-3 horas para primeira instalação
- Paciência para configurar ambiente

### Windows - Passo a Passo Completo

#### 1. Instalar Flutter

```powershell
# Baixar Flutter
# Vá em: https://docs.flutter.dev/get-started/install/windows
# Baixe o ZIP e extraia em C:\src\flutter

# Adicionar ao PATH
# Windows + R → "sysdm.cpl" → Avançado → Variáveis de Ambiente
# Adicione: C:\src\flutter\bin

# Testar
flutter --version
```

#### 2. Instalar Android Studio

```powershell
# Baixar Android Studio
# https://developer.android.com/studio

# Instalar componentes:
# - Android SDK
# - Android SDK Platform-Tools
# - Android SDK Build-Tools
# - Android Emulator (opcional)

# Aceitar licenças
flutter doctor --android-licenses
# Pressione 'y' para todas
```

#### 3. Compilar o App

```powershell
# Navegar até pasta do projeto
cd C:\caminho\para\florandei

# Obter dependências
flutter pub get

# Compilar APK
flutter build apk --release

# APK estará em:
# build\app\outputs\flutter-apk\app-release.apk
```

### Linux (Ubuntu/Debian)

```bash
# 1. Instalar Flutter
cd ~
git clone https://github.com/flutter/flutter.git -b stable
echo 'export PATH="$PATH:$HOME/flutter/bin"' >> ~/.bashrc
source ~/.bashrc

# 2. Instalar dependências
sudo apt-get update
sudo apt-get install -y curl git unzip xz-utils zip libglu1-mesa
sudo apt-get install -y clang cmake ninja-build pkg-config libgtk-3-dev

# 3. Instalar Android Studio
sudo snap install android-studio --classic

# 4. Configurar Android SDK (no Android Studio)
# Tools → SDK Manager → Install SDK 34

# 5. Aceitar licenças
flutter doctor --android-licenses

# 6. Compilar
cd ~/florandei
flutter pub get
flutter build apk --release
```

### Mac

```bash
# 1. Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Instalar Flutter
cd ~
git clone https://github.com/flutter/flutter.git -b stable
echo 'export PATH="$PATH:$HOME/flutter/bin"' >> ~/.zshrc
source ~/.zshrc

# 3. Instalar Xcode Command Line Tools
xcode-select --install

# 4. Instalar Android Studio
brew install --cask android-studio

# 5. Aceitar licenças
flutter doctor --android-licenses

# 6. Compilar
cd ~/florandei
flutter pub get
flutter build apk --release
```

---

## Verificar se Ambiente Está OK

```bash
flutter doctor -v
```

**Deve mostrar:**
```
[✓] Flutter (Channel stable, 3.x.x)
[✓] Android toolchain - develop for Android devices (Android SDK version 34)
[✓] Android Studio (version 2023.x)
[✓] Connected device (se celular conectado)
```

---

## Instalar APK no Celular

### Opção 1: Via USB

```bash
# No celular:
# 1. Configurações → Sobre → Tocar 7x em "Número da versão"
# 2. Configurações → Opções de desenvolvedor → Ativar "Depuração USB"
# 3. Conectar cabo USB ao computador

# No computador:
cd florandei
flutter install

# Ou manualmente:
adb install build/app/outputs/flutter-apk/app-release.apk
```

### Opção 2: Copiar Arquivo

1. Copie `app-release.apk` para o celular (WhatsApp, Bluetooth, Drive, etc)
2. No celular, abra o arquivo
3. Permita "Instalar apps de fontes desconhecidas"
4. Toque em "Instalar"

---

## Problemas Comuns

### "flutter: command not found"

**Solução**: Flutter não está no PATH
```bash
# Windows: Adicione C:\src\flutter\bin ao PATH do sistema
# Linux/Mac: Adicione ao ~/.bashrc ou ~/.zshrc:
export PATH="$PATH:$HOME/flutter/bin"
```

### "Android SDK not found"

**Solução**: 
1. Abra Android Studio
2. Tools → SDK Manager
3. Instale Android SDK Platform 34
4. Execute: `flutter doctor --android-licenses`

### "Unable to locate Android SDK"

```bash
# Defina manualmente:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Compilação falha com erro de memória

```bash
# Aumente heap size do Gradle
# Edite: android/gradle.properties
# Adicione:
org.gradle.jvmargs=-Xmx4096m
```

### APK não instala: "Parse error"

- Causa: APK corrompido ou incompatível
- Solução: Recompile com `flutter clean` primeiro:
```bash
flutter clean
flutter pub get
flutter build apk --release
```

---

## Tamanhos Esperados

- **Código fonte**: ~10 MB
- **Dependências (node_modules/flutter)**: ~2 GB
- **Android SDK**: ~3-5 GB
- **APK final**: ~25-35 MB

---

## Tempo Estimado

| Etapa | Tempo |
|-------|-------|
| Instalar Flutter + Android Studio | 1-2 horas |
| Download de dependências | 30 min |
| Primeira compilação | 5-10 min |
| Compilações seguintes | 2-3 min |

---

## Resumo Executivo

**Recomendação**: Use Codemagic (online, grátis, sem dor de cabeça)

**Se insistir em local**:
1. Instale Flutter + Android Studio
2. Execute `flutter doctor` até tudo OK
3. `flutter pub get`
4. `flutter build apk --release`
5. Transfira APK para celular

**Suporte**: Documentação oficial Flutter → https://docs.flutter.dev/

---

Boa sorte! 🍀
