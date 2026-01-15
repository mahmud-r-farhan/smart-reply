class ApiConstants {
  // Base URL for the backend API
  static const String baseUrl = 'http://192.168.1.107:5006/api/';
  // Use localhost for physical device testing:
  // static const String baseUrl = 'http://YOUR_LOCAL_IP:5006/api';
  
  // API endpoints
  static const String suggestReply = '/suggest-reply';
  static const String enhanceText = '/enhance-text';
}

class AppMode {
  static const String reply = 'reply';
  static const String enhance = 'enhance';
}

class ResponseStyle {
  static const String professional = 'professional';
  static const String friendly = 'friendly';
  static const String casual = 'casual';
  static const String formal = 'formal';
  static const String flating = 'flating';
  static const String romantic = 'romantic';
  
  static const List<StyleOption> options = [
    StyleOption(
      value: professional,
      label: 'Professional',
      emoji: '💼',
      description: 'Formal and business-like tone',
    ),
    StyleOption(
      value: friendly,
      label: 'Friendly',
      emoji: '😊',
      description: 'Warm and approachable style',
    ),
    StyleOption(
      value: casual,
      label: 'Casual',
      emoji: '👋',
      description: 'Relaxed and conversational',
    ),
    StyleOption(
      value: formal,
      label: 'Formal',
      emoji: '🎩',
      description: 'Respectful and official tone',
    ),
    StyleOption(
      value: flating,
      label: 'Flating',
      emoji: '😏',
      description: 'Flirty compliment with romantic interest',
    ),
    StyleOption(
      value: romantic,
      label: 'Romantic',
      emoji: '💕',
      description: 'Affectionate and emotionally warm',
    ),
  ];
}

class StyleOption {
  final String value;
  final String label;
  final String emoji;
  final String description;
  
  const StyleOption({
    required this.value,
    required this.label,
    required this.emoji,
    required this.description,
  });
}
