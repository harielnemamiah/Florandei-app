import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:image/image.dart' as img;
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart';

class ImageService {
  static final ImagePicker _picker = ImagePicker();

  static Future<String?> pickImageFromCamera() async {
    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        maxWidth: 1920,
        maxHeight: 1920,
        imageQuality: 85,
      );

      if (photo == null) return null;

      return await _saveAndCompressImage(photo.path);
    } catch (e) {
      return null;
    }
  }

  static Future<String?> pickImageFromGallery() async {
    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1920,
        maxHeight: 1920,
        imageQuality: 85,
      );

      if (photo == null) return null;

      return await _saveAndCompressImage(photo.path);
    } catch (e) {
      return null;
    }
  }

  static Future<String> _saveAndCompressImage(String sourcePath) async {
    final appDir = await getApplicationDocumentsDirectory();
    final imagesDir = Directory('${appDir.path}/images');
    
    if (!await imagesDir.exists()) {
      await imagesDir.create(recursive: true);
    }

    final fileName = '${DateTime.now().millisecondsSinceEpoch}.jpg';
    final targetPath = '${imagesDir.path}/$fileName';

    // Ler imagem original
    final sourceFile = File(sourcePath);
    final imageBytes = await sourceFile.readAsBytes();
    final image = img.decodeImage(imageBytes);

    if (image == null) {
      // Se falhar a decodificação, apenas copia o arquivo
      await sourceFile.copy(targetPath);
      return targetPath;
    }

    // Redimensionar se necessário (máximo 1920px no lado maior)
    img.Image resized = image;
    if (image.width > 1920 || image.height > 1920) {
      if (image.width > image.height) {
        resized = img.copyResize(image, width: 1920);
      } else {
        resized = img.copyResize(image, height: 1920);
      }
    }

    // Comprimir e salvar
    final compressedBytes = img.encodeJpg(resized, quality: 85);
    final targetFile = File(targetPath);
    await targetFile.writeAsBytes(compressedBytes);

    return targetPath;
  }

  static Future<bool> deleteImage(String imagePath) async {
    try {
      final file = File(imagePath);
      if (await file.exists()) {
        await file.delete();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  static Future<int> getImageFileSize(String imagePath) async {
    try {
      final file = File(imagePath);
      if (await file.exists()) {
        return await file.length();
      }
      return 0;
    } catch (e) {
      return 0;
    }
  }
}
