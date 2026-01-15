import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/chat_provider.dart';
import '../widgets/gradient_background.dart';
import '../widgets/mode_selector.dart';
import '../widgets/style_selector.dart';
import '../widgets/input_section.dart';
import '../widgets/results_section.dart';
import '../widgets/empty_state.dart';
import '../widgets/developer_side_panel.dart';
import '../utils/app_theme.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _showSidePanel = false;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      body: GradientBackground(
        child: SafeArea(
          child: Consumer<ChatProvider>(
            builder: (context, chatProvider, child) {
              return Column(
                children: [
                  // Modern App Header
                  _buildModernHeader(),
                  
                  // Main Content - Scrollable
                  Expanded(
                    child: CustomScrollView(
                      slivers: [
                        // Mode Selector
                        SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            child: ModeSelector(
                              currentMode: chatProvider.mode,
                              onModeChanged: chatProvider.setMode,
                            ),
                          ),
                        ),
                        
                        // Style Selector
                        SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            child: StyleSelector(
                              currentStyle: chatProvider.style,
                              onStyleChanged: chatProvider.setStyle,
                            ),
                          ),
                        ),
                        
                        // Input Section
                        SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: InputSection(
                              input: chatProvider.input,
                              mode: chatProvider.mode,
                              loading: chatProvider.loading,
                              error: chatProvider.error,
                              onInputChanged: chatProvider.setInput,
                              onSubmit: chatProvider.getResults,
                              onClear: chatProvider.clear,
                            ),
                          ),
                        ),
                        
                        const SliverToBoxAdapter(child: SizedBox(height: 16)),
                        
                        // Results Section
                        SliverToBoxAdapter(
                          child: chatProvider.results.isNotEmpty
                              ? Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 16),
                                  child: ResultsSection(
                                    results: chatProvider.results,
                                    mode: chatProvider.mode,
                                    loading: chatProvider.loading,
                                    onRegenerate: chatProvider.regenerate,
                                  ),
                                )
                              : const SizedBox.shrink(),
                        ),
                        
                        // Empty State or Spacing
                        SliverFillRemaining(
                          hasScrollBody: false,
                          child: chatProvider.results.isEmpty && !chatProvider.loading
                              ? EmptyState(
                                  loading: chatProvider.loading,
                                  results: chatProvider.results,
                                  input: chatProvider.input,
                                )
                              : const SizedBox.shrink(),
                        ),
                      ],
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ),
      // Side Panel
      endDrawer: Drawer(
        backgroundColor: Colors.transparent,
        child: DeveloperSidePanel(
          onClose: () {
            Navigator.of(context).pop();
          },
        ),
      ),
    );
  }

  Widget _buildModernHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: AppTheme.backgroundCard.withValues(alpha: 0.5),
        border: Border(
          bottom: BorderSide(
            color: AppTheme.borderColor.withValues(alpha: 0.3),
          ),
        ),
      ),
      child: Row(
        children: [
          // Logo with gradient - Tappable
          GestureDetector(
            onTap: () {
              _scaffoldKey.currentState?.openEndDrawer();
            },
            child: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                gradient: AppTheme.primaryGradient,
                borderRadius: BorderRadius.circular(12),
                boxShadow: AppTheme.softShadow,
              ),
              child: Image.network(
                'https://i.postimg.cc/HkhmHFxy/icons8-chatbot-48.png',
                width: 26,
                height: 26,
                errorBuilder: (context, error, stackTrace) {
                  return const Icon(
                    Icons.wifi_off,
                    size: 26,
                    color: Colors.white,
                  );
                },
              ),
            ),
          ),
          const SizedBox(width: 12),
          // Title and subtitle
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Smart Reply',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.5,
                      ),
                ),
                Text(
                  'AI-powered messaging',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppTheme.textMuted,
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
