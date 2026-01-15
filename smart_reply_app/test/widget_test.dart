
import 'package:flutter_test/flutter_test.dart';
import 'package:smart_reply_app/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const SmartReplyApp());

    // Verify that the app title is present
    expect(find.text('Smart Reply'), findsOneWidget);
  });
}
