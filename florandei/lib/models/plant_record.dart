class PlantRecord {
  final String id;
  final double latitude;
  final double longitude;
  final String? imagePath;
  final String description;
  final List<String> tags;
  final DateTime createdAt;

  PlantRecord({
    required this.id,
    required this.latitude,
    required this.longitude,
    this.imagePath,
    required this.description,
    required this.tags,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'latitude': latitude,
      'longitude': longitude,
      'imagePath': imagePath,
      'description': description,
      'tags': tags.join(','),
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory PlantRecord.fromMap(Map<String, dynamic> map) {
    return PlantRecord(
      id: map['id'] as String,
      latitude: map['latitude'] as double,
      longitude: map['longitude'] as double,
      imagePath: map['imagePath'] as String?,
      description: map['description'] as String,
      tags: (map['tags'] as String).split(',').where((t) => t.isNotEmpty).toList(),
      createdAt: DateTime.parse(map['createdAt'] as String),
    );
  }

  PlantRecord copyWith({
    String? id,
    double? latitude,
    double? longitude,
    String? imagePath,
    String? description,
    List<String>? tags,
    DateTime? createdAt,
  }) {
    return PlantRecord(
      id: id ?? this.id,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      imagePath: imagePath ?? this.imagePath,
      description: description ?? this.description,
      tags: tags ?? this.tags,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
