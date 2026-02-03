import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/plant_record.dart';

class DatabaseService {
  static final DatabaseService instance = DatabaseService._init();
  static Database? _database;

  DatabaseService._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('florandei.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future<void> _createDB(Database db, int version) async {
    await db.execute('''
      CREATE TABLE plant_records (
        id TEXT PRIMARY KEY,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        imagePath TEXT,
        description TEXT NOT NULL,
        tags TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    ''');
  }

  Future<String> insertRecord(PlantRecord record) async {
    final db = await instance.database;
    await db.insert('plant_records', record.toMap());
    return record.id;
  }

  Future<List<PlantRecord>> getAllRecords() async {
    final db = await instance.database;
    final result = await db.query('plant_records', orderBy: 'createdAt DESC');
    return result.map((map) => PlantRecord.fromMap(map)).toList();
  }

  Future<PlantRecord?> getRecordById(String id) async {
    final db = await instance.database;
    final maps = await db.query(
      'plant_records',
      where: 'id = ?',
      whereArgs: [id],
    );

    if (maps.isNotEmpty) {
      return PlantRecord.fromMap(maps.first);
    }
    return null;
  }

  Future<List<PlantRecord>> getRecordsByTag(String tag) async {
    final db = await instance.database;
    final result = await db.query(
      'plant_records',
      where: 'tags LIKE ?',
      whereArgs: ['%$tag%'],
      orderBy: 'createdAt DESC',
    );
    return result.map((map) => PlantRecord.fromMap(map)).toList();
  }

  Future<int> updateRecord(PlantRecord record) async {
    final db = await instance.database;
    return db.update(
      'plant_records',
      record.toMap(),
      where: 'id = ?',
      whereArgs: [record.id],
    );
  }

  Future<int> deleteRecord(String id) async {
    final db = await instance.database;
    return await db.delete(
      'plant_records',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<List<String>> getAllTags() async {
    final db = await instance.database;
    final result = await db.query('plant_records');
    
    final Set<String> allTags = {};
    for (var record in result) {
      final tags = (record['tags'] as String).split(',');
      allTags.addAll(tags.where((t) => t.isNotEmpty));
    }
    
    return allTags.toList()..sort();
  }

  Future<void> close() async {
    final db = await instance.database;
    db.close();
  }
}
