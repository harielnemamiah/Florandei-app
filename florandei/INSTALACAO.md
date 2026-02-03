# 📱 Guia de Instalação - Florandei

## Método Mais Simples: PWA via Termux

### Passo 1: Instalar Termux
1. Baixe **Termux** da F-Droid: https://f-droid.org/en/packages/com.termux/
   - Não use a versão da Google Play (está desatualizada)
   - OU baixe direto: https://github.com/termux/termux-app/releases

2. Instale o APK normalmente

### Passo 2: Configurar Termux
Abra o Termux e execute os comandos (copie e cole linha por linha):

```bash
# Atualizar pacotes
pkg update -y && pkg upgrade -y

# Instalar Python
pkg install python -y

# Dar permissão para acessar storage
termux-setup-storage
```

Quando pedir permissão de storage, **aceite**.

### Passo 3: Copiar Arquivos do Florandei

**Opção A - Se você já tem os arquivos no celular:**
```bash
# Ir para a pasta onde estão os arquivos
cd /sdcard/Download/florandei

# Ou se estiverem em outra pasta:
# cd /sdcard/[caminho]/florandei
```

**Opção B - Se os arquivos estão em um arquivo ZIP:**
```bash
# Instalar unzip
pkg install unzip -y

# Extrair
cd /sdcard/Download
unzip florandei.zip
cd florandei
```

### Passo 4: Iniciar Servidor
```bash
# Iniciar servidor HTTP na porta 8000
python -m http.server 8000
```

Você verá uma mensagem: `Serving HTTP on :: port 8000 ...`

**IMPORTANTE**: Deixe o Termux aberto em segundo plano!

### Passo 5: Acessar o App

1. Abra o **Chrome** (ou Firefox) no seu Android

2. Acesse: `http://localhost:8000`

3. O app Florandei abrirá!

4. Toque nos 3 pontinhos (⋮) do navegador

5. Toque em **"Adicionar à tela inicial"** ou **"Instalar app"**

6. Confirme

7. Pronto! Agora você tem o ícone do Florandei na tela inicial

### Passo 6: Usar o App

- **Para abrir**: Toque no ícone do Florandei na tela inicial
  
- **IMPORTANTE**: Quando usar o app, certifique-se que o Termux está rodando o servidor!

- Para parar o servidor no Termux: pressione `Ctrl+C`

### Automatizar (Opcional)

Crie um script para facilitar:

```bash
# No Termux, crie um script
cd ~
nano start-florandei.sh
```

Cole isto no arquivo:
```bash
#!/data/data/com.termux/files/usr/bin/bash
cd /sdcard/Download/florandei
python -m http.server 8000
```

Salve: `Ctrl+X`, depois `Y`, depois `Enter`

Torne executável:
```bash
chmod +x ~/start-florandei.sh
```

Agora para iniciar o servidor, basta:
```bash
~/start-florandei.sh
```

## Permissões Necessárias

Ao abrir o Florandei pela primeira vez:

1. **Localização**: Clique em "Permitir" quando solicitado
   - Necessário para GPS em tempo real
   
2. **Câmera**: Clique em "Permitir" quando for tirar primeira foto
   - Necessário para capturar imagens das plantas

## Solução de Problemas

### "Não consigo acessar localhost:8000"
- ✓ Certifique-se que o Termux está rodando o servidor
- ✓ Veja se aparece "Serving HTTP on..." no Termux
- ✓ Tente `http://127.0.0.1:8000` ao invés

### "GPS não funciona"
- ✓ Ative a localização nas configurações do Android
- ✓ Dê permissão de localização ao Chrome
- ✓ Teste ao ar livre (GPS interno não funciona bem)

### "Câmera não abre"
- ✓ Dê permissão de câmera ao Chrome nas configurações
- ✓ Certifique-se que nenhum outro app está usando a câmera

### "App não salva dados"
- ✓ Não limpe dados/cache do Chrome
- ✓ Faça backup regular (botão 💾)

### "Termux fecha sozinho"
- ✓ Desative otimização de bateria para o Termux:
  - Configurações → Aplicativos → Termux → Bateria → Sem restrições

## Alternativa: Converter para APK Real

Se quiser um APK de verdade (não precisa do Termux):

### Via PWA Builder (Recomendado)

1. Hospede os arquivos online (GitHub Pages é gratuito)

2. Acesse: https://www.pwabuilder.com/

3. Cole a URL do seu app

4. Clique em "Package for Stores"

5. Escolha "Android"

6. Configure:
   - Name: Florandei
   - Package ID: com.florandei.app
   - Signing: Use Test Key (para uso pessoal)

7. Baixe o APK

8. Instale no celular:
   - Configurações → Segurança → Fontes desconhecidas: Ativar
   - Abra o APK e instale

## Vantagens de Cada Método

**Termux (localhost):**
- ✅ 100% offline
- ✅ Sem depender de servidor externo
- ✅ Dados totalmente privados
- ❌ Precisa rodar Termux

**APK Real:**
- ✅ Abre direto como app normal
- ✅ Não precisa Termux
- ✅ Mais conveniente
- ❌ Precisa hospedar online ou converter

## Dicas de Uso

1. **Faça backup semanal**: Toque em 💾 e salve o JSON

2. **Use WiFi para primeira carga**: Mapas serão baixados

3. **No campo**: App funciona 100% offline depois de carregar

4. **Bateria**: GPS consome bateria, use com moderação

5. **Precisão GPS**: Funciona melhor ao ar livre

## Suporte

Para problemas ou dúvidas, verifique:
- README.md (documentação completa)
- Logs do Termux (erros aparecem lá)
- Permissões do Android

---

**Desenvolvido especialmente para registro de flora em Cravinhos-SP** 🌿
